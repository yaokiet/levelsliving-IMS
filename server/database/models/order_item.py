from __future__ import annotations

from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Boolean,
    Date,
    Time,
    Text,
    DECIMAL,
    ARRAY,
)
from sqlalchemy.orm import relationship, validates
from database.database import Base

class OrderItem(Base):
    __tablename__ = "order_item"

    # Composite PK
    order_id = Column(Integer, ForeignKey("order.order_id", ondelete="CASCADE"), primary_key=True)

    #TODO: Set ondelete=RESTRIC to preserve records
    #TODO: implement soft delete
    #If an item is linked to any order_item, it should be archived and not deleted, might have to add additional column to track the state of an item
    #Need to refine item's model, service and route accordingly
    item_id = Column(Integer, ForeignKey("item.id", ondelete="RESTRICT"), primary_key=True)

    qty_requested = Column(Integer, nullable=False)
    tag = Column(ARRAY(Text), nullable=True)         
    delivery_date = Column(Date, nullable=False)
    delivery_time = Column(Time, nullable=True)
    team_assigned = Column(Text, nullable=True)      
    delivered = Column(Boolean, nullable=False)
    custom = Column(Text, nullable=True)
    remarks = Column(Text, nullable=True)
    value = Column(DECIMAL(10, 2), nullable=False)

    ALLOWED_TAGS = {"shopee", "private", "custom"}

    @validates("tag")
    def validate_tags(self, key, tag_list):
        if tag_list is not None:
            for tag in tag_list:
                if tag not in self.ALLOWED_TAGS:
                    raise ValueError(f"Invalid tag: {tag}")
        return tag_list

    # Relationships
    # Many OrderItem -> one Order (N -> 1)
    order = relationship(
        "Order",
        back_populates="order_items",
        lazy="joined",                   
    )

    # Many OrderItem -> one Item (N -> 1)
    item = relationship(
        "Item",
        back_populates="order_items",
        lazy="joined",                   
        passive_deletes=True,
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self) -> str:
        return f"<OrderItem order_id={self.order_id} item_id={self.item_id} qty={self.qty_requested}>"
