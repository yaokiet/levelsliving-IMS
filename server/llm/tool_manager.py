from google.genai import types
import asyncio
from config import settings


class ToolManager:
    def __init__(self, tools):
        self.tools = tools
        self._setup_tools()

    def _convert_function_declaration(self, tool):
        return {
            "name": tool.name,
            "description": tool.description,
            "parameters": tool.parameters,
        }

    def _setup_tools(self):
        self.tools_map = {tool.name: tool for tool in self.tools}

    def get_tool(self, tool_name: str):
        if tool_name not in self.tools_map:
            raise ValueError(f"Tool '{tool_name}' not found.")
        return self.tools_map.get(tool_name)

    def get_all_tools(self):
        return self.tools

    def get_tool_declarations(self):
        return types.Tool(function_declarations=[self._convert_function_declaration(tool) for tool in self.tools])

    async def execute_tool(self, tool_name: str, args: dict = {}):
        tool = self.get_tool(tool_name)
        if not tool:
            raise ValueError(f"Tool '{tool_name}' not found.")
        return await tool.execute(**args)

    async def execute_tools(self, tool_calls: list):
        reuslts = await asyncio.gather(
            *(self.execute_tool(tool_call.name, tool_call.args)
              for tool_call in tool_calls),
            return_exceptions=True
        )
        return reuslts


