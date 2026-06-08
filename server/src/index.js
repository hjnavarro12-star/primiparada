const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { pool } = require('./db');

const authRoutes = require('./routes/auth');
const programsRoutes = require('./routes/programs');
const schedulesRoutes = require('./routes/schedules');
const roomsRoutes = require('./routes/rooms');

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
