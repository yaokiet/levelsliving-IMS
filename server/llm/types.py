from pydantic import BaseModel
from typing import List, Optional


class ToolResult(BaseModel):
    name: str = ""
    data: Optional[dict] = None
    links: Optional[List[str]] = []

class ToolCall(BaseModel):
    name: str
    args: dict