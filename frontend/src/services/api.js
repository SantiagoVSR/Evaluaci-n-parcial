const API_URL = 'http://localhost:5000/api';

export const getLotes = async () => {
    const response = await fetch(`${API_URL}/lotes`);
    return await response.json();
};

export const createLote = async (lote) => {
    return await fetch(`${API_URL}/lotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lote)
    });
};

// Nueva función para Transformación
export const procesarLote = async (id) => {
    return await fetch(`${API_URL}/lotes/${id}/transformar`, {
        method: 'PUT'
    });
};

// Nueva función para Logística
export const enviarLote = async (id, datosLogistica) => {
    return await fetch(`${API_URL}/lotes/${id}/logistica`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosLogistica)
    });
};