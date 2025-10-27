from logger import log_execution
import os
import json
from llm.types import ToolResult
from llm.data import get_table_names_of_database, get_table_schema
class GetViewSchemaTool():
    def __init__(self, database_name):
        self.database_name = database_name
        self.name = "get_view_schema"
        self.description = "Retrieves the schema of a database view."
        self.parameters = {
            "type": "object",
            "properties": {
            "table_name": {
                "type": "string",
                "description": "The name of the table to retrieve the schema for.",
                "enum": get_table_names_of_database(database_name)
            }
            },
            "required": ["table_name"]
        }
        self.loading_text = "Retrieving view schema..."

    @log_execution
    async def execute(self, table_name: str):
        schema = get_table_schema(self.database_name, table_name)
        return ToolResult(name=self.name, data={"schema": schema})
