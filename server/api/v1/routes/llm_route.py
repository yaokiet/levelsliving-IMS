from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from logger import logger

# Import all the necessary components from your LLM package
from llm.agent import Agent
from llm.databaseAgent import DatabaseAgent
from llm.prompt_manager import PromptManager
from llm.history_manager import ChatHistoryManager
from llm.tool_manager import ToolManager
from llm.tools.get_view_schema import GetViewSchemaTool
from llm.tools.execute_sql_query_on_view import ExecuteSqlQuery
from llm.prompts import BASE_PROMPT

# --- Router Setup ---
router = APIRouter(prefix="/llm", tags=["LLM"])

# --- Agent Initialization ---
# This setup is done once when the application starts.
inventory_tools = [
    GetViewSchemaTool(database_name="inventory_management"),
    ExecuteSqlQuery(),
]
inventory_tool_manager = ToolManager(tools=inventory_tools)
inventory_prompt_manager = PromptManager(base_prompt=BASE_PROMPT)
main_prompt_manager = PromptManager()


@router.websocket("/query")
async def websocket_endpoint(websocket: WebSocket):
    """
    Handles the AI chat session over a WebSocket connection.
    Each connection gets a new, isolated agent instance.
    """
    await websocket.accept()
    logger.info("WebSocket connection accepted.")
    
    # Create Per-Connection Agent Instances for conversation isolation
    main_chat_history_manager = ChatHistoryManager()
    inventory_chat_history_manager = ChatHistoryManager()

    inventory_agent_instance = DatabaseAgent(
        database_name="inventory_management",
        tool_manager=inventory_tool_manager,
        prompt_manager=inventory_prompt_manager,
        chat_history_manager=inventory_chat_history_manager,
        debug=True
    )

    agent_instance = Agent(
        agents=[inventory_agent_instance],
        prompt_manager=main_prompt_manager,
        chat_history_manager=main_chat_history_manager,
        debug=True
    )

    try:
        while True:
            query = await websocket.receive_text()
            logger.info(f"Received query: {query}")

            async for event in agent_instance.generate_content(query):
                # --- FIX IS HERE ---
                await websocket.send_json(event.model_dump())
                # --- END FIX ---

    except WebSocketDisconnect:
        logger.info("Client disconnected.")
    except Exception as e:
        logger.error(f"An error occurred in the WebSocket: {e}", exc_info=True)
        # Use .model_dump() here as well if you construct an Event object for errors
        await websocket.send_json({"type": "error", "data": str(e)})
        await websocket.close()

