const express = require('express');
const { pool } = require('../db');
const { authMiddleware, adminMiddleware } = require('../auth');

const router = express.Router();

// Todas las rutas admin requieren autenticacion + rol admin
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/users — Lista todos los usuarios registrados
router.get('/users', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, program_id, created_at FROM users ORDER BY created_at DESC LIMIT 50'
    );
    res.json({ data: result.rows, total: result.rows.length });
  } catch (err) {
    console.error('Admin list users error:', err.message);
    res.status(500).json({ error: 'Error al consultar usuarios' });
  }
});

// GET /api/admin/schedules — Lista todos los horarios del sistema
router.get('/schedules', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.user_id, s.subject, s.teacher, s.day_of_week,
              s.start_time, s.end_time, s.created_at
       FROM schedules s
       ORDER BY s.created_at DESC
       LIMIT 100`
    );
    res.json({ data: result.rows, total: result.rows.length });
  } catch (err) {
    console.error('Admin list schedules error:', err.message);
    res.status(500).json({ error: 'Error al consultar horarios' });
  }
});

// GET /api/admin/stats — Estadisticas generales
router.get('/stats', async (_req, res) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const schedulesCount = await pool.query('SELECT COUNT(*) FROM schedules');
    const newsCount = await pool.query('SELECT COUNT(*) FROM news_cache');

    res.json({
      users: parseInt(usersCount.rows[0].count, 10),
      schedules: parseInt(schedulesCount.rows[0].count, 10),
      news: parseInt(newsCount.rows[0].count, 10)
    });
  } catch (err) {
    console.error('Admin stats error:', err.message);
    res.status(500).json({ error: 'Error al consultar estadisticas' });
  }
});

module.exports = router;
