from llm.prompts import BASE_PROMPT



class PromptManager:
    def __init__(self, user_name: str = None, user_department: str = None, base_prompt: str = BASE_PROMPT):
        """Initialize the PromptManager with optional user information.
        Args:
            user_name (str): The name of the user.
            user_department (str): The department of the user.
        """
        self.user_name = user_name if user_name else None
        self.user_department = user_department if user_department else None
        self.base_prompt = base_prompt

    def set_user_info(self, name: str, department: str):
        self.user_name = name
        self.user_department = department

    def __get_base_prompt(self) -> str:
        return self.base_prompt

    def get_agent_prompt_tool_calling(self) -> str:
        return f"""
{self.__get_base_prompt()}

## These are very important guidelines for this step:
    - You should not provide any response if no tools is to be called, generation will be done in the next step."""

    def get_agent_prompt_generation(self) -> str:
        return f"""
{self.__get_base_prompt()}

## These are very important guidelines for this step:
    - All tools that are to be called has been called and the responses are in the chat history.
    - You MUST NEVER EVER provide any information that is not provided by a output of a tool.
    - You MUST provide enough information in your response to answer the user's question. DO NOT ask the user to refer to the knowledge base or links
"""
