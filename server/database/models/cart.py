from __future__ import annotations
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database.database import Base

class CartItem(Base):
    """
    SQLAlchemy model for items in a user's cart.
    """
    __tablename__ = "cart_item"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    item_id = Column(Integer, ForeignKey("item.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False)

    # Define relationships
    user = relationship("User", back_populates="cart_items")
    item = relationship("Item") # Assuming Item model has a cart_items back-populates field

    __table_args__ = (
        UniqueConstraint('user_id', 'item_id', name='_user_item_uc'),
    )

    def __repr__(self) -> str:
        return f"<CartItem user_id={self.user_id} item_id={self.item_id} quantity={self.quantity}>"

# Note: You may need to add a 'cart_items' relationship to your User model
# for the back_populates to work, e.g.,
# in User model: cart_items = relationship("CartItem", back_populates="user", passive_deletes=True)
