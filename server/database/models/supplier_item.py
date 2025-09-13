from __future__ import annotations

from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from database.database import Base

class SupplierItem(Base):
    __tablename__ = "supplier_item"

    id = Column(Integer, primary_key=True, index=True)

    #Note: [item_id: RESTRICT] (block item delete if still mapped; preserves catalog integrity)
    item_id = Column(Integer, ForeignKey("item.id", ondelete="RESTRICT"), nullable=False, index=True)
    supplier_id = Column(Integer, ForeignKey("supplier.id", ondelete="CASCADE"), nullable=False, index=True)

    __table_args__ = (
        UniqueConstraint("item_id", "supplier_id", name="uix_item_supplier"),
        Index("ix_supplier_item_supplier_item", "supplier_id", "item_id"),
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
