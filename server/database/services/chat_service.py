from database.models.chat import Chat
from util.uuid import get_uuid


class ChatService:
    def __init__(self, db):
        self.db = db

    def create_chat(self):
        chat_id = get_uuid()
        db_chat = Chat(id=chat_id)
        self.db.add(db_chat)
        self.db.commit()
        return chat_id

    def get_chat(self, chat_id):
        db_chat = self.db.query(Chat).filter(Chat.id == chat_id).first()
        if db_chat is None:
            raise Exception("Chat not found")
        return db_chat

    def get_all_chats(self):
        db_chats = self.db.query(Chat).all()
        return db_chats

    def get_chat_history_of(self, chat_id):
        db_chat = self.get_chat(chat_id)
        return db_chat.chat_history if db_chat.chat_history else []

    def update_chat_history(self, chat_id, chat_history):
        db_chat = self.get_chat(chat_id)
        db_chat.chat_history = chat_history
        self.db.commit()
