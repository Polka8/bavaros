from flask import jsonify, request
from .models import db, User
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import re

def init_routes(app):
  
    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"message": "Dati mancanti"}), 400

        email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(email_pattern, data['email']):
            return jsonify({"message": "Formato email non valido"}), 400

        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"message": "Email già registrata"}), 409

        try:
            new_user = User(
                email=data['email'],
                nome=data.get('nome', ''),
                cognome=data.get('cognome', '')
            )
            new_user.set_password(data['password'])
            db.session.add(new_user)
            db.session.commit()

            access_token = create_access_token(identity=new_user.id, expires_delta=timedelta(days=1))
            return jsonify({"message": "Registrazione completata", "token": access_token}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Errore server: {str(e)}"}), 500

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"message": "Dati mancanti"}), 400

        user = User.query.filter_by(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            return jsonify({"message": "Credenziali non valide"}), 401

        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
        return jsonify({
            "message": "Login riuscito",
            "token": access_token,
            "user": {
                "nome": user.nome,
                "cognome": user.cognome,
                "ruolo": user.ruolo.value,
                "email": user.email
            }
        }), 200

    @app.route('/api/profilo', methods=['GET'])
    @jwt_required()
    def get_profile():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "Utente non trovato"}), 404

        return jsonify({
            "id": user.id,
            "email": user.email,
            "nome": user.nome,
            "cognome": user.cognome,
            "ruolo": user.ruolo.value
        }), 200
