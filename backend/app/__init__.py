from flask import Flask
from flask_cors import CORS  # Se devi abilitare CORS per comunicare con Angular

def create_app():
    app = Flask(__name__)
    CORS(app)  # Abilita CORS per evitare problemi di cross-origin

    # Registra le rotte dal file routes.py
    with app.app_context():
        from .routes import init_routes
        init_routes(app)

    return app
