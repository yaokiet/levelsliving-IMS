from __future__ import annotations
from typing import Any, Dict, List, Optional, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class PageMeta(BaseModel):
    page: int
    size: int
    has_prev: bool
    has_next: bool
    sort: List[str]
    filters: Dict[str, Any]
    total: Optional[int] = None
    pages: Optional[int] = None

class Paginated(BaseModel, Generic[T]):
    """
    Generic pagination envelope: { meta, data }
    """
    meta: PageMeta
    data: List[T]
