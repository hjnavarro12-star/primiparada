const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const cron    = require('node-cron');

const { pool }          = require('./db');
const { runMigrations } = require('./migrate');
const { runScrapeNews } = require('./jobs/scrape-news');

const authRoutes      = require('./routes/auth');
const programsRoutes  = require('./routes/programs');
const schedulesRoutes = require('./routes/schedules');
const roomsRoutes     = require('./routes/rooms');
const adminRoutes     = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 8084;

// ── Middleware ────────────────────────────────────────────────
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

// ── Rutas ─────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/programs',  programsRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/rooms',     roomsRoutes);
app.use('/api/admin',     adminRoutes);

// GET /api/news — últimas 4 noticias del cache local
app.get('/api/news', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, image_url, published_at, source_url, scraped_at
       FROM news_cache
       ORDER BY scraped_at DESC
       LIMIT 4`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('News error:', err.message);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
});

// GET /api/health — verificación de conexión a BD
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ── Arranque ──────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`Primiparada API running on port ${PORT}`);

  // 1. Ejecutar migraciones idempotentes
  await runMigrations();

  // 2. Scraping inicial de noticias (si el cache está vacío o expirado)
  await runScrapeNews();

  // 3. Programar scraping cada 12 horas
  cron.schedule('0 */12 * * *', async () => {
    console.log('[cron] Ejecutando scraping programado de noticias...');
    await runScrapeNews();
  });

  console.log('[cron] Scraping de noticias programado cada 12 horas.');
});
