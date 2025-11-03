from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, TIMESTAMP, UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.database import Base
from sqlalchemy.dialects.postgresql import UUID


class Chat(Base):
    __tablename__ = 'chat'

    id = Column(UUID(as_uuid=True), primary_key=True)
    created_on = Column(
        DateTime, server_default=func.now(), nullable=False)
    updated_on = Column(DateTime, server_default=func.now(),
                        onupdate=func.now(), nullable=False)
    chat_history = Column(JSON, nullable=True)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
