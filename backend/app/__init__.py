
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})
    

    db_host = os.getenv("DATABASE_HOST", "db")
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://root:password123@{db_host}/bavaros'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        from .routes import init_routes
        init_routes(app)
        db.create_all()
    
    return app
