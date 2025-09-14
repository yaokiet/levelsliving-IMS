from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base

class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_item"

    purchase_order_id = Column(Integer, ForeignKey("purchase_order.id", ondelete="CASCADE"), primary_key=True)
    item_id = Column(Integer, ForeignKey("item.id", ondelete="CASCADE"), primary_key=True)
    qty = Column(Integer, nullable=False)
    supplier_item_id = Column(Integer, ForeignKey("supplier_item.id", ondelete="SET NULL"), nullable=True)

    #relationships
    purchase_order = relationship("PurchaseOrder", back_populates="po_items", lazy="joined")
    item = relationship("Item", lazy="joined")
    supplier_item = relationship("SupplierItem", lazy="joined")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
