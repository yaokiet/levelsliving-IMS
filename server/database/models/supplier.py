from sqlalchemy import Column, Integer, String

from sqlalchemy.orm import relationship
from database.database import Base

class Supplier(Base):
    __tablename__ = "supplier"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), unique=False, nullable=False, index=True)
    description = Column(String(64))
    email = Column(String(254))
    contact_number = Column(String(20))
    
    purchase_orders = relationship(
        "PurchaseOrder",
        back_populates="supplier",
        passive_deletes=True,
        lazy="selectin",
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
