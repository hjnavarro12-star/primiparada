const { Pool } = require('pg');
const path = require('path');

// Cargar variables de entorno
try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.production') });
} catch {
  // dotenv no disponible
}

// Credenciales con fallback directo (preferir .env.production en el VPS)
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_NAME = process.env.DB_NAME || 'semi1_primiparada_prod';
const DB_USER = process.env.DB_USER || 'semi1_primiparada';
const DB_PASSWORD = process.env.DB_PASSWORD || '$eminarioPr1m1parada';

const isRemote = DB_HOST !== 'localhost' && DB_HOST !== '127.0.0.1';

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: String(DB_PASSWORD),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = { pool };
