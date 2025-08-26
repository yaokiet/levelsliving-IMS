from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    LARK_APP_ID: str
    LARK_APP_SECRET: str
    LARK_SPREADSHEET_ID: str
    LARK_BASE_URL: str = "https://open.larksuite.com/open-apis"

    class Config:
        env_file = ".env"
        extra = "allow"   # 👈 accept unlisted vars

settings = Settings()

