import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/livestream_overlay')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = FLASK_ENV == 'development'
