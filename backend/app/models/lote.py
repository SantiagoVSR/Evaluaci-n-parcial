from app import db

class Lote(db.Model):
    __tablename__ = 'lotes'
    id = db.Column(db.Integer, primary_key=True)
    codigo_lote = db.Column(db.String(50), unique=True, nullable=False)
    id_cultivo = db.Column(db.String(50))
    fecha_cosecha = db.Column(db.Date)
    
    lavado = db.Column(db.Boolean, default=False)
    empaquetado = db.Column(db.Boolean, default=False)
    calidad_aprobada = db.Column(db.Boolean, nullable=True)
    temperatura_transporte = db.Column(db.Float, nullable=True)
    cliente_final = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'codigo': self.codigo_lote,
            'cultivo': self.id_cultivo,
            'fecha': self.fecha_cosecha.isoformat() if self.fecha_cosecha else None,
            'estado': self.obtener_estado_texto(),
            'cliente': self.cliente_final,
            'temp': self.temperatura_transporte
        }

    def obtener_estado_texto(self):
        if self.cliente_final: return 'ENTREGADO'
        if self.calidad_aprobada: return 'PROCESADO'
        return 'COSECHA'