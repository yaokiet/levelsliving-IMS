from sqlalchemy import Column, Integer, String, CheckConstraint
from sqlalchemy.orm import relationship
from database.database import Base  # assuming your SQLAlchemy Base is defined here

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), nullable=False)
    role = Column(String(10), nullable=False)
    email = Column(String(254), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)

    # Relationships
    # purchase_orders = relationship("PurchaseOrder", back_populates="user")

    __table_args__ = (
        CheckConstraint("role IN ('admin', 'user')", name="check_user_role"),
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
