from app.models.lote import Lote
from app import db

class LoteRepository:
    @staticmethod
    def get_all():
        return Lote.query.all()
    
    @staticmethod
    def create(lote):
        db.session.add(lote)
        db.session.commit()
        return lote