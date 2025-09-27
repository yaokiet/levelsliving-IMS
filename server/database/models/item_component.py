from sqlalchemy import Column, Integer, ForeignKey, PrimaryKeyConstraint
from database.database import Base

class ItemComponent(Base):
    __tablename__ = "item_component"

    parent_id = Column(Integer, ForeignKey("item.id", ondelete="CASCADE"), nullable=False)
    child_id = Column(Integer, ForeignKey("item.id", ondelete="CASCADE"), nullable=False)
    qty_required = Column(Integer, nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint("parent_id", "child_id", name="pk_item_component"),
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
