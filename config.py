import os
from pathlib import Path

class Config:
    """Base configuration class"""
    
    # Basic Flask config
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production-123456789')
    
    # Encoding configuration
    JSON_AS_ASCII = False
    JSONIFY_PRETTYPRINT_REGULAR = True
    
    # Database configuration
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    # Session configuration
    SESSION_TYPE = 'filesystem'
    SESSION_FILE_DIR = './sessions'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_KEY_PREFIX = 'portfolio:'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # File upload configuration
    UPLOAD_FOLDER = 'static'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # Create necessary directories
    @staticmethod
    def init_app(app):
        """Initialize the application with required directories"""
        os.makedirs(Config.SESSION_FILE_DIR, exist_ok=True)
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///portfolio_dev.db'
    SESSION_COOKIE_SECURE = False
    
    # SQLite specific engine options
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'connect_args': {'check_same_thread': False} if 'sqlite' in (os.environ.get('DATABASE_URL') or 'sqlite:///portfolio_dev.db') else {}
    }

class ProductionConfig(Config):
    """Production configuration for PythonAnywhere"""
    DEBUG = False
    
    # For PythonAnywhere, you might want to use a different database path
    # or MySQL database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///portfolio.db'
    
    # Enable secure cookies in production
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = 'Strict'
    
    # Database specific engine options
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'connect_args': {'check_same_thread': False} if 'sqlite' in (os.environ.get('DATABASE_URL') or 'sqlite:///portfolio.db') else {}
    }

class PythonAnywhereConfig(ProductionConfig):
    """Specific configuration for PythonAnywhere deployment"""
    
    # PythonAnywhere specific paths
    def __init__(self):
        super().__init__()
        # Adjust paths for PythonAnywhere if needed
        username = os.environ.get('PA_USERNAME', 'yourusername')
        if username != 'yourusername':
            base_path = f'/home/{username}/portfolio'
            self.SESSION_FILE_DIR = f'{base_path}/sessions'
            self.UPLOAD_FOLDER = f'{base_path}/static'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'pythonanywhere': PythonAnywhereConfig,
    'default': DevelopmentConfig
}