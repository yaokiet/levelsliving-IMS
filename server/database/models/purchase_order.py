from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from server.database.database import Base

class PurchaseOrder(Base):
    __tablename__ = "purchase_order"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("supplier.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
    order_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
