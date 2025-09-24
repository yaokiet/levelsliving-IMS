from __future__ import annotations

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from server.database.database import Base

class Item(Base):
    __tablename__ = "item"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(32), unique=True, nullable=False, index=True)
    type = Column(String(32), nullable=False)
    item_name = Column(String(64), nullable=False)
    variant = Column(String(64))
    qty = Column(Integer, nullable=False)
    threshold_qty = Column(Integer, nullable=False)

    # Relationships
    # One Item -> many OrderItem
    order_items = relationship(
        "OrderItem",
        back_populates="item",
        lazy="selectin",               # list-friendly; batches backrefs
        passive_deletes=True,
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self) -> str:
        return f"<Item id={self.id} sku={self.sku} name={self.item_name}>"
