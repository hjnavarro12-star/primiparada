const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

// Middleware: requiere autenticación
router.use(authMiddleware);

// Middleware: requiere rol admin
router.use(async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT raw_user_meta_data->>'role' as role FROM auth.users WHERE id = $1`,
      [req.user.sub]
    );

    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
    }

    next();
  } catch (err) {
    // Fallback: si no puede leer auth.users, verificar claim del token
    if (req.user.role === 'admin') {
      return next();
    }
    console.error('Admin check error:', err.message);
    return res.status(403).json({ error: 'Acceso denegado.' });
  }
});

// GET /api/admin/users — lista todos los usuarios
router.get('/users', async (_req, res) => {
  try {
    // Intentar leer de auth.users (donde Supabase Auth guarda los usuarios)
    let result = await pool.query(
      `SELECT id, email, raw_user_meta_data->>'role' as role, created_at
       FROM auth.users ORDER BY created_at DESC LIMIT 50`
    );

    // Fallback a public.users si auth.users no es accesible
    if (result.rows.length === 0) {
      result = await pool.query(
        `SELECT id, email, program_id, created_at FROM public.users ORDER BY created_at DESC LIMIT 50`
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Admin users error:', err.message);
    // Si no puede acceder a auth.users, intentar public.users
    try {
      const fallback = await pool.query(
        `SELECT id, email, program_id, created_at FROM public.users ORDER BY created_at DESC LIMIT 50`
      );
      res.json(fallback.rows);
    } catch {
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
