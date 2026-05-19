# backend/app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from datetime import timedelta
from extensions import mail  

# Import routes (blueprints)
from routes.auth import auth_bp
from routes.code import code_bp
from routes.user import user_bp
from routes.community import community_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    mail.init_app(app)
    # Enable CORS (important for React frontend)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    mail.init_app(app)
    
    # Register Blueprints (routes)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(code_bp, url_prefix='/api/code')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(community_bp, url_prefix='/api/community')

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    print(" AI Code Platform Backend Started Successfully!")
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)