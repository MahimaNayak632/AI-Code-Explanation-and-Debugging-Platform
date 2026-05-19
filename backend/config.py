# backend/config.py
import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'super-secret-key-2026')
    # JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-super-secret-key-2026')

    JWT_SECRET_KEY = os.getenv(
        'JWT_SECRET_KEY',
        'mahima_ai_code_platform_ultra_secure_jwt_secret_key_2026_123456789'
    )
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # MySQL Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'SQLALCHEMY_DATABASE_URI',
        'mysql+pymysql://root:Mahesh%402003@localhost/ai_code_platform'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

    # === AI Configuration ===
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")       # ← Correct line

    # Optional: OpenAI fallback later
    # OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    # Email Configuration
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS") == "True"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")