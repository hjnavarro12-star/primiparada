const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

// Middleware: requiere autenticación
router.use(authMiddleware);

// Middleware: requiere rol admin (verificado desde el token JWT decodificado)
router.use((req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
});

// GET /api/admin/users — lista todos los usuarios desde auth.users
router.get('/users', async (_req, res) => {
  try {
    // Intentar auth.users (tabla interna de Supabase Auth)
    const result = await pool.query(
      `SELECT id, email, raw_user_meta_data->>'role' as role, created_at
       FROM auth.users ORDER BY created_at DESC LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) {
    // Fallback: public.users
    try {
      const fallback = await pool.query(
        `SELECT id, email, program_id, created_at FROM public.users ORDER BY created_at DESC LIMIT 50`
      );
      res.json(fallback.rows);
    } catch {
      console.error('Admin users error:', err.message);
      res.status(500).json({ error: 'Error al consultar usuarios' });
    }
  }
});

// GET /api/admin/schedules — lista todos los horarios
router.get('/schedules', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.user_id, s.subject, s.teacher, s.day_of_week,
              s.start_time::text, s.end_time::text, s.created_at
       FROM public.schedules s
       ORDER BY s.day_of_week, s.start_time
       LIMIT 100`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Admin schedules error:', err.message);
    res.status(500).json({ error: 'Error al consultar horarios' });
  }
});

module.exports = router;
