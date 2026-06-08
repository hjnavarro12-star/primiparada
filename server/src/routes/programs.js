const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, name, code, faculty FROM programs ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('List programs error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, code, faculty FROM programs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get program error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
