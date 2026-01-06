// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { getLotes, createLote, procesarLote, enviarLote } from './services/api';
import './App.css'; // Importamos los estilos nuevos

function App() {
  const [lotes, setLotes] = useState([]);
  const [form, setForm] = useState({ codigo: '', cultivo: '', fecha: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { cargarLotes(); }, []);

  const cargarLotes = async () => {
    const data = await getLotes();
    setLotes(data);
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!form.codigo || !form.cultivo || !form.fecha) return;
    
    setLoading(true);
    await createLote(form);
    setLoading(false);
    setForm({ codigo: '', cultivo: '', fecha: '' });
    cargarLotes();
  };

  const handleProcesar = async (id) => {
    if (window.confirm("¿Confirmar lavado y empaquetado de este lote?")) {
      await procesarLote(id);
      cargarLotes();
    }
  };

  const handleEnviar = async (id) => {
    const cliente = prompt("Ingrese el nombre del Cliente Final:");
    if (cliente) {
      // Simulamos temperatura aleatoria entre 10 y 14 grados
      const temp = (Math.random() * (14 - 10) + 10).toFixed(1);
      await enviarLote(id, { cliente: cliente, temperatura: temp });
      cargarLotes();
    }
  };

  // Función auxiliar para saber qué clase CSS usar según el estado
  const getStatusClass = (estado) => {
    if (estado === 'PROCESADO') return 'status-proceso';
    if (estado === 'ENTREGADO') return 'status-entregado';
    return 'status-cosecha';
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🥭 Sistema de Trazabilidad</h1>
        <p>Control de calidad y logística: Cooperativa de Mangos</p>
      </div>
      
      {/* --- FORMULARIO DE REGISTRO --- */}
      <form onSubmit={handleCrear} className="form-card">
        <div className="form-group">
          <label>Código de Lote</label>
          <input 
            className="form-input"
            placeholder="Ej: M-2024-001" 
            value={form.codigo} 
            onChange={e=>setForm({...form, codigo: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Campo de Cultivo</label>
          <input 
            className="form-input"
            placeholder="Ej: Hacienda La Florida" 
            value={form.cultivo} 
            onChange={e=>setForm({...form, cultivo: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Fecha de Cosecha</label>
          <input 
            type="date" 
            className="form-input"
            value={form.fecha} 
            onChange={e=>setForm({...form, fecha: e.target.value})}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : '+ Registrar Lote'}
        </button>
      </form>

      {/* --- GRID DE LOTES --- */}
      <div className="grid-lotes">
        {lotes.map(l => (
          <div key={l.id} className={`card-lote ${getStatusClass(l.estado)}`}>
            
            <div className="card-header">
              <span className="card-title">📦 {l.codigo}</span>
              <span className="badge" style={{background: l.estado === 'ENTREGADO' ? '#4caf50' : '#999'}}>
                {l.estado}
              </span>
            </div>

            {/* --- LÍNEA DE TIEMPO VISUAL --- */}
            <div className="timeline">
              {/* Paso 1: Origen (Siempre activo si existe el lote) */}
              <div className="step completed" title="Cosechado">🌱</div>
              
              {/* Paso 2: Proceso */}
              <div className={`step ${l.estado === 'PROCESADO' || l.estado === 'ENTREGADO' ? 'completed' : ''}`} title="Procesado">
                ⚙️
              </div>
              
              {/* Paso 3: Logística */}
              <div className={`step ${l.estado === 'ENTREGADO' ? 'completed' : ''}`} title="Entregado">
                🚚
              </div>
            </div>

            {/* --- DETALLES --- */}
            <div className="details">
              <div>📍 <strong>Origen:</strong> {l.cultivo}</div>
              {l.temp && <div>🌡️ <strong>Temp:</strong> {l.temp}°C</div>}
              {l.cliente && <div>🛒 <strong>Cliente:</strong> {l.cliente}</div>}
            </div>

            {/* --- BOTONES DE ACCIÓN --- */}
            <div className="card-actions">
              {l.estado === 'COSECHA' && (
                <button onClick={() => handleProcesar(l.id)} className="btn-action btn-process">
                  Iniciar Procesamiento ➡️
                </button>
              )}

              {l.estado === 'PROCESADO' && (
                <button onClick={() => handleEnviar(l.id)} className="btn-action btn-ship">
                  Despachar Camión 🚚
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {lotes.length === 0 && (
        <p style={{textAlign: 'center', color: '#999', marginTop: '50px'}}>
          No hay lotes activos. Registra uno arriba para comenzar la trazabilidad.
        </p>
      )}
    </div>
  );
}

export default App;