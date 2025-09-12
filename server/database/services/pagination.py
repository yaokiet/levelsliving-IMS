# app/core/pagination.py
from __future__ import annotations
from typing import Iterable, Optional, Any, Dict, List
from datetime import datetime, date

"""Pagination utilities shared across list endpoints.

This module provides small, model-agnostic helpers to:
- sanitize page/size inputs (`clamp_page_size`)
- normalize date-like filter values (`to_datetime`)
- parse client sort tokens into SQLAlchemy order_by objects (`parse_sort`)
- build a consistent pagination metadata payload (`build_meta`)
"""


def clamp_page_size(page: int | None, size: int | None, *, max_page_size: int = 200) -> tuple[int, int]:
    """Clamp and normalize pagination inputs.

    Args:
      page: 1-based page number (may be None/invalid).
      size: page size (may be None/invalid).
      max_page_size: hard upper limit for page size.

    Returns:
      A tuple `(page, size)` where:
        - `page >= 1`
        - `1 <= size <= max_page_size`
        - defaults apply when inputs are None/invalid (page=1, size=50)
    """
    page = max(1, int(page or 1))
    size = max(1, min(int(size or 50), max_page_size))
    return page, size


def to_datetime(val: Optional[str | date | datetime]) -> Optional[datetime]:
    """Normalize various date-like inputs to a `datetime`.

    Accepts:
      - `datetime`: returned as-is
      - `date`: converted to midnight of that day
      - `str`: either 'YYYY-MM-DD' or ISO-8601 (e.g., '2025-09-01T15:30:00')

    Args:
      val: Input value to parse.

    Returns:
      A `datetime` if parsing succeeds; otherwise `None`.
      (No timezone conversion is applied.)
    """
    if val is None:
        return None
    if isinstance(val, datetime):
        return val
    if isinstance(val, date):
        return datetime(val.year, val.month, val.day)
    s = str(val).strip()
    try:
        return datetime.strptime(s, "%Y-%m-%d") if len(s) == 10 else datetime.fromisoformat(s)
    except ValueError:
        return None


def parse_sort(
    sort_tokens: Optional[Iterable[str]],
    allowed: Dict[str, Any],
    default_order_by: List[Any],
) -> List[Any]:
    """Convert client sort tokens into a SQLAlchemy `order_by` list.

    A token looks like `"field:dir"`, e.g., `"order_date:desc"`.
    Only fields present in `allowed` are honored; others are ignored.

    Args:
      sort_tokens: Iterable of sort tokens; if None/empty, defaults apply.
      allowed: Map from field name to SQLAlchemy column/expression.
      default_order_by: Fallback list of SQLAlchemy order_by expressions.

    Returns:
      A list of SQLAlchemy order_by expressions. Falls back to `default_order_by`
      if no valid tokens are provided.
    """
    if not sort_tokens:
        return default_order_by
    order_by: List[Any] = []
    for token in sort_tokens:
        field, _, direction = token.partition(":")
        col = allowed.get(field.strip())
        if not col:
            continue
        direction = (direction or "asc").lower()
        order_by.append(col.desc() if direction in ("desc", "descending") else col.asc())
    return order_by or default_order_by


def build_meta(
    *,
    page: int,
    size: int,
    has_prev: bool,
    has_next: bool,
    sort_tokens: Optional[Iterable[str]],
    filters: Dict[str, Any],
    total: Optional[int] = None,
    pages: Optional[int] = None,
    default_sort: Iterable[str] = ("order_date:desc", "order_id:desc"),
) -> Dict[str, Any]:
    """Construct a consistent pagination metadata dictionary.

    Args:
      page: Current 1-based page number.
      size: Page size.
      has_prev: True if a previous page exists.
      has_next: True if a next page exists (per size+1 fetch or count).
      sort_tokens: Client-supplied sort tokens to echo back; if falsy,
        `default_sort` is used.
      filters: Filter values to echo back; empty/None values are dropped.
      total: Optional total number of records (include only if computed).
      pages: Optional total number of pages (include only if computed).
      default_sort: Sort tokens to report when `sort_tokens` is falsy.

    Returns:
      A `dict` with keys:
        - page, size, has_prev, has_next
        - sort: list[str]
        - filters: dict[str, Any]
        - total (optional), pages (optional)
    """
    meta: Dict[str, Any] = {
        "page": page,
        "size": size,
        "has_prev": has_prev,
        "has_next": has_next,
        "sort": list(sort_tokens) if sort_tokens else list(default_sort),
        "filters": {k: v for k, v in filters.items() if v is not None and v != ""},
    }
    if total is not None:
        meta["total"] = total
    if pages is not None:
        meta["pages"] = pages
    return meta
