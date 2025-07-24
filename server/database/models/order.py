from sqlalchemy import Column, Integer, BigInteger, String, DateTime
from database.database import Base

class Order(Base):
    __tablename__ = "order"

    order_id = Column(Integer, primary_key=True, index=True)
    shopify_order_id = Column(BigInteger)
    order_date = Column(DateTime(timezone=True), nullable=False)  
    name = Column(String(64), nullable=False)
    contact = Column(String(16), nullable=False)
    street = Column(String(254), nullable=False)
    unit = Column(String(16), nullable=True)
    postal_code = Column(String(6), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
