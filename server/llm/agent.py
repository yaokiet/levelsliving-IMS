from typing import List
from util.event import EventType, Event
from logger import logger
from llm.tool_manager import ToolManager
from llm.history_manager import ChatHistoryManager
from llm.prompt_manager import PromptManager
from llm.generative_model import GenerativeModelClient
from llm.schema import ResponseSchema
from llm.databaseAgent import DatabaseAgent
from google.genai import types

class Agent():
    def __init__(self, agents: List[DatabaseAgent],
                 prompt_manager: PromptManager, chat_history_manager: ChatHistoryManager, debug=False):
        self.debug = debug
        self.agents = agents
        self.agent_map = {agent.name: agent for agent in agents}
        self.prompt_manager = prompt_manager
        self.chat_history_manager = chat_history_manager
        self.logs = []
        self.tools_called = []

    def _log(self, *args):
        self.logs.append(" ".join(str(arg) for arg in args))
        if self.debug:
            logger.debug(" ".join(str(arg) for arg in args))

    async def _preprocessing(self):
        self._log("Main agent preprocessing started")
        generative_model_client = GenerativeModelClient(
            system_instruction=self.prompt_manager.get_agent_prompt_tool_calling(),
        )
        function_calls = await generative_model_client.generate_function_calls(
            chat_history=self.chat_history_manager.get_chat_history(),
            tools=[types.Tool(function_declarations=[{
                "name": agent.name,
                "description": agent.description,
                "parameters": agent.parameters,
            } for agent in self.agents])],
        )
        if not function_calls:
            self._log("No agent delegation detected")
            return None

        self._log(f"Agent delegation detected: {function_calls}")
        # Assuming we only delegate to one agent at a time
        delegated_agent_name = function_calls[0].name
        return delegated_agent_name

    async def generate_content(self, user_prompt):
        self.chat_history_manager.add_user_prompt(user_prompt)
        delegated_agent_name = await self._preprocessing()

        if delegated_agent_name and delegated_agent_name in self.agent_map:
            delegated_agent = self.agent_map.get(delegated_agent_name)
            
            # --- FIX HERE: Use keyword arguments ---
            yield Event(type=EventType.LOADING_TEXT, data=delegated_agent.loading_text)
            
            # Pass the main history to the sub-agent so it has full context
            delegated_agent.chat_history_manager = self.chat_history_manager
            async for event in delegated_agent.generate_content(user_prompt):
                yield event
            return

        # --- FIX HERE: Use keyword arguments ---
        yield Event(type=EventType.LOADING_TEXT, data="Curating Response...")
        
        self._log("Generating final response from main agent")
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
                 # --- FIX HERE: Use keyword arguments ---
                yield Event(type=EventType.RESPONSE, data=partial_response.model_dump())
                last_response = partial_response

        if last_response:
            self.chat_history_manager.add_model_response(last_response.model_dump_json())
