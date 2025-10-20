from pydantic import SecretStr
from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    LARK_APP_ID: str
    LARK_APP_SECRET: str
    LARK_SPREADSHEET_ID: str
    LARK_BASE_URL: str = "https://open.larksuite.com/open-apis"
    
    mail_username: str
    mail_password: SecretStr
    mail_from: str
    mail_port: int
    mail_server: str
    mail_from_name: str

    class Config:
        env_file = ".env"
        extra = "allow"  

settings = Settings()