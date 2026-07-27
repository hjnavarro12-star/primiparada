const path = require('path');

// Cargar .env.production si existe
try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.production') });
} catch {
  // dotenv no disponible — usar variables de entorno del sistema
}

// Fallback: si DB_PASSWORD no se cargó, usar valor por defecto de Supabase
if (!process.env.DB_PASSWORD) {
  process.env.DB_HOST = 'db.xxqtmbptexnusrhitvnk.supabase.co';
  process.env.DB_PORT = '5432';
  process.env.DB_NAME = 'postgres';
  process.env.DB_USER = 'postgres';
  process.env.DB_PASSWORD = 'OQwLSsStwGTN287C';
  process.env.JWT_SECRET = 'W2qL88h9AxvM3zsZj0ppWdCcFlIPRKOJdUZ8xjY8dPdVEsNbBfkPmwDaEDW4TZXaltsOy42xD7ekvxvrh9m3UQ==';
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { pool } = require('./db');

const authRoutes = require('./routes/auth');
const programsRoutes = require('./routes/programs');
const schedulesRoutes = require('./routes/schedules');
const roomsRoutes = require('./routes/rooms');
const adminRoutes = require('./routes/admin');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 8084;

app.use(helmet());
app.use(cors({
  origin: [
    'https://primiparada.seminario1.eleueleo.com',
    'http://localhost:4200',
    'http://localhost:8100',
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/programs', programsRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Primiparada API running on port ${PORT}`);
});
