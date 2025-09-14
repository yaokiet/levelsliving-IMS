from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.database import Base

class PurchaseOrder(Base):
    __tablename__ = "purchase_order"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("supplier.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
    order_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    status = Column(String(32), nullable=True)

    #Relationships
    # PurchaseOrder (1) -> PurchaseOrderItem (N)
    po_items = relationship(
        "PurchaseOrderItem",
        back_populates="purchase_order",
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="selectin",
    )

    # PurchaseOrder (N) -> Supplier (1)
    supplier = relationship("Supplier", back_populates="purchase_orders", lazy="joined")

    # PurchaseOrder (N) -> User (1)
    user = relationship("User", back_populates="purchase_orders", lazy="joined")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
