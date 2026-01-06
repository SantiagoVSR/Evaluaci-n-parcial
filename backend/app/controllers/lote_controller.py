from flask import Blueprint, request, jsonify
from app.services.lote_service import LoteService

lote_bp = Blueprint('lote', __name__, url_prefix='/api/lotes')

@lote_bp.route('', methods=['GET'])
def index():
    lotes = LoteService.obtener_todos()
    # Convertimos los datos para que el frontend los entienda fácil
    resultado = []
    for l in lotes:
        estado = "COSECHA"
        if l.calidad_aprobada: estado = "PROCESADO"
        if l.cliente_final: estado = "ENTREGADO"
        
        resultado.append({
            'id': l.id,
            'codigo': l.codigo_lote,
            'cultivo': l.id_cultivo,
            'estado': estado,
            'cliente': l.cliente_final,
            'temp': l.temperatura_transporte
        })
    return jsonify(resultado)

@lote_bp.route('', methods=['POST'])
def store():
    try:
        data = request.json
        LoteService.crear_lote(data)
        return jsonify({'msg': 'Creado'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Endpoint para Paso 2: Transformación
@lote_bp.route('/<int:id>/transformar', methods=['PUT'])
def transformar(id):
    try:
        LoteService.registrar_transformacion(id)
        return jsonify({'msg': 'Transformado'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Endpoint para Paso 3: Logística
@lote_bp.route('/<int:id>/logistica', methods=['PUT'])
def logistica(id):
    try:
        data = request.json
        LoteService.registrar_logistica(id, data)
        return jsonify({'msg': 'Enviado'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400