from app.repositories.lote_repository import LoteRepository
from app.models.lote import Lote
from datetime import datetime
from app import db

class LoteService:
    @staticmethod
    def obtener_todos():
        return LoteRepository.get_all()

    @staticmethod
    def crear_lote(data):
        if 'codigo' not in data: raise ValueError("Código obligatorio")
        # Paso 1: Origen
        nuevo = Lote(
            codigo_lote=data['codigo'],
            id_cultivo=data['cultivo'],
            fecha_cosecha=datetime.strptime(data['fecha'], '%Y-%m-%d').date()
        )
        return LoteRepository.create(nuevo)

    @staticmethod
    def registrar_transformacion(id_lote):
        lote = Lote.query.get(id_lote)
        if not lote: raise ValueError("Lote no encontrado")
        
        # Paso 2: Transformación (Simulamos lavado y empaquetado)
        lote.lavado = True
        lote.empaquetado = True
        lote.calidad_aprobada = True # Aprobamos calidad automáticamente para el ejemplo
        
        db.session.commit() # Guardamos cambios
        return lote

    @staticmethod
    def registrar_logistica(id_lote, data):
        lote = Lote.query.get(id_lote)
        if not lote: raise ValueError("Lote no encontrado")
        
        # Paso 3: Logística
        if not lote.calidad_aprobada: raise ValueError("No pasó calidad")
        
        lote.temperatura_transporte = data.get('temperatura', 12.0)
        lote.cliente_final = data.get('cliente', 'Cliente Genérico')
        lote.fecha_entrega = datetime.now().date()
        
        db.session.commit()
        return lote