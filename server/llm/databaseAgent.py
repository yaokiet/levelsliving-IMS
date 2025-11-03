from util.event import EventType, Event
from llm.tool_manager import ToolManager
from llm.prompt_manager import PromptManager
from llm.history_manager import ChatHistoryManager
from llm.generative_model import GenerativeModelClient
from llm.schema import ResponseSchema
from logger import logger
from typing import List, Coroutine

class DatabaseAgent():
    def __init__(self, database_name, tool_manager: ToolManager, prompt_manager: PromptManager,  chat_history_manager: ChatHistoryManager, debug=True):
        self.name = f"{database_name}_agent"
        self.description = "An agent that interacts with the database to execute queries and retrieve information."
        self.parameters = {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The user's query, reinforced with previous chat history.",
                }

            },
            "required": ["query"]
        }
        self.tool_manager = tool_manager
        self.prompt_manager = prompt_manager
        self.chat_history_manager = chat_history_manager
        self.loading_text = f"Delegating to {self.name}"
        self.debug = debug
        self.logs = []

    def _log(self, *args):
        self.logs.append(" ".join(str(arg) for arg in args))
        if self.debug:
            logger.debug(" ".join(str(arg) for arg in args))

    async def _execute_tools(self, function_calls: List) -> Coroutine:
        self._log(f"Executing tools for {len(function_calls)} function calls")
        results = await self.tool_manager.execute_tools(function_calls)
        self._log(f"Executed tools, results: {results}")
        function_responses = [result for result in results if result is not None]
        if function_responses:
            self.chat_history_manager.add_model_function_responses(function_responses)

            
    async def _preprocessing(self):
        self._log("Model generation started for preprocessing")

        while True:
            generative_model_client = GenerativeModelClient(
                system_instruction=self.prompt_manager.get_agent_prompt_tool_calling(),
            )
            function_calls = await generative_model_client.generate_function_calls(
                chat_history=self.chat_history_manager.get_chat_history(),
                tools=[self.tool_manager.get_tool_declarations()],
            )

            if not function_calls:
                self._log("No more function calls detected. Exiting preprocessing loop.")
                break

            self._log(f"Function calls detected: {function_calls}")
            self.chat_history_manager.add_model_function_calls(function_calls)

            first_function_call_name = function_calls[0].name
            loading_text = self.tool_manager.get_tool(first_function_call_name).loading_text
            yield loading_text
            
            await self._execute_tools(function_calls)

    async def generate_content(self, user_prompt):
        tools_were_run = False
        async for loading_text in self._preprocessing():
            tools_were_run = True
            yield Event(type=EventType.LOADING_TEXT, data=loading_text)
        
        if not tools_were_run:
            self._log("CRITICAL: Preprocessing failed to call any tools. Aborting generation.")
            yield Event(type=EventType.LOADING_TEXT, data="Curating Response...") # Yield loading first
            
            failed_response = ResponseSchema(
                response="I was unable to retrieve that information from the database.",
                data=None
            )
            
            yield Event(type=EventType.RESPONSE, data=failed_response.model_dump())
            
            self.chat_history_manager.add_model_response(failed_response.model_dump_json())
            return 

        yield Event(type=EventType.LOADING_TEXT, data="Curating Response...")
        
        self._log("Generating final response (tools ran successfully)")
        generative_model_client = GenerativeModelClient(
            system_instruction=self.prompt_manager.get_agent_prompt_generation(),
        )
        response_stream = generative_model_client.generate_content_as_schema(
            chat_history=self.chat_history_manager.get_chat_history(),
            response_schema=ResponseSchema,
        )
        
        last_response = None
        async for partial_response in response_stream:
            if partial_response:
                yield Event(type=EventType.RESPONSE, data=partial_response.model_dump())
                last_response = partial_response
        
        if last_response:
            self.chat_history_manager.add_model_response(last_response.model_dump_json())