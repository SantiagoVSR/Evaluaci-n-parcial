CREATE TABLE IF NOT EXISTS lotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_lote TEXT UNIQUE NOT NULL,
    -- Datos Origen
    id_cultivo TEXT NOT NULL,
    fecha_cosecha DATE NOT NULL,
    -- Datos Transformación
    lavado BOOLEAN DEFAULT 0,
    empaquetado BOOLEAN DEFAULT 0,
    calidad_aprobada BOOLEAN,
    -- Datos Logística
    temperatura_transporte REAL,
    cliente_final TEXT,
    fecha_entrega DATE
);