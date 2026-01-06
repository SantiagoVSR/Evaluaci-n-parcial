from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    # Conexión a la DB creada en la Capa 1
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(basedir, '../../trazabilidad.db')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    CORS(app)
    db.init_app(app)
    
    from .controllers.lote_controller import lote_bp
    app.register_blueprint(lote_bp)
    
    return app