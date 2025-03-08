from . import db
from werkzeug.security import generate_password_hash, check_password_hash
import enum

class RuoloEnum(enum.Enum):
    admin = "admin"
    cliente = "cliente"

class User(db.Model):
    __tablename__ = 'utente'
    id = db.Column('id_utente', db.Integer, primary_key=True)
    nome = db.Column(db.String(50), nullable=False)
    cognome = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column('psw', db.String(200), nullable=False)
    ruolo = db.Column(db.Enum(RuoloEnum), nullable=False, default=RuoloEnum.cliente)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
