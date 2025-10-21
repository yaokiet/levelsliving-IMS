from enum import Enum
from pydantic import BaseModel
from typing import Any

class EventType(str, Enum):
    """
    Defines the types of events that can be sent over the WebSocket.
    """
    LOADING_TEXT = "loading_text"
    RESPONSE = "response"
    ERROR = "error"

class Event(BaseModel):
    """
    Represents a single event to be sent to the client.
    This class inherits from Pydantic's BaseModel, which provides
    automatic data validation and serialization methods like .model_dump().
    """
    type: EventType
    data: Any
