from sqlalchemy import Column, Integer, String
from database.database import Base

class Supplier(Base):
    __tablename__ = "supplier"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), unique=True, nullable=False, index=True)
    description = Column(String(64))
    email = Column(String(254))
    contact_number = Column(String(20))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
