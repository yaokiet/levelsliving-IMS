from pathlib import Path
from typing import Optional

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict  # v2-style

BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    # Lark
    # LARK_APP_ID: str
    # LARK_APP_SECRET: str
    # LARK_SPREADSHEET_ID: str
    # LARK_BASE_URL: str = "https://open.larksuite.com/open-apis"

    # Mail
    mail_username: str
    mail_password: SecretStr
    mail_from: str
    mail_port: int
    mail_server: str
    mail_from_name: str

    # Google GenAI
    GOOGLE_GENAI_USE_VERTEXAI: Optional[bool] = False
    GOOGLE_GENAI_PROJECT_ID: Optional[str] = "levelslivingai"
    GOOGLE_GENAI_LOCATION: Optional[str] = "global"

    # Google Sheets Integration
    GOOGLE_SHEETS_ENABLED: Optional[bool] = True
    GOOGLE_SHEETS_CREDENTIALS_PATH: Optional[str] = str(BASE_DIR / "google_credentials.json")
    GOOGLE_SHEETS_SPREADSHEET_ID: Optional[str] = ""

    # pydantic v2 config
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="allow",
    )

settings = Settings()