from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from server.database.database import Base

class SupplierItem(Base):
    __tablename__ = "supplier_item"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("item.id", ondelete="CASCADE"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("supplier.id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (
        UniqueConstraint("item_id", "supplier_id", name="uix_item_supplier"),
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
