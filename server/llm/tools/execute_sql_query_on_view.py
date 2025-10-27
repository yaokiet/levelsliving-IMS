import asyncio
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from logger import log_execution
from llm.types import ToolResult

# --- Self-Contained Database Logic ---

def _execute_sync_query(query: str):
    """
    A synchronous function that connects to the database and executes a single query.
    This is designed to be run in a separate thread to avoid blocking the async event loop.
    """
    conn = None
    try:
        # Get the database URL from the environment variable set in docker-compose
        db_url = os.environ.get("DATABASE_URL")
        if not db_url:
            raise ValueError("DATABASE_URL environment variable not set")

        conn = psycopg2.connect(db_url)
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query)
            # fetchall() returns a list of rows or an empty list if no results
            results = cur.fetchall()
            # Convert each row (which is a RealDictRow) to a standard dict
            return [dict(row) for row in results]
    finally:
        if conn:
            conn.close()

# --- Tool Definition ---

class ExecuteSqlQuery():
    name = "execute_sql_query_on_database"
    description = "Executes one or more SQL queries on the database and returns the results."
    parameters = {
        "type": "object",
        "properties": {
            "sql_queries": {
                "type": "array",
                "items": {"type": "string"},
                "description": "A list of SQL queries to execute."
            },
        },
        "required": ["sql_queries"]
    }
    loading_text = "Executing SQL query to retrieve data..."

    @log_execution
    async def execute(self, sql_queries: list[str]):
        """
        Asynchronously executes a list of SQL queries in a non-blocking way.
        """
        try:
            loop = asyncio.get_running_loop()
            
            # Create a task for each query to run in the default thread pool executor
            tasks = [
                loop.run_in_executor(None, _execute_sync_query, query)
                for query in sql_queries
            ]
            
            # asyncio.gather runs all tasks concurrently and waits for them to complete
            query_results = await asyncio.gather(*tasks)
            
            return ToolResult(
                name=self.name,
                data={"results": query_results}
            )
        except Exception as e:
            log_execution.error(f"Error executing SQL query: {e}", exc_info=True)
            return ToolResult(
                name=self.name,
                data={"error": str(e)}
            )
