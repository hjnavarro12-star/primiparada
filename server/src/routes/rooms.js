const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, code, block, floor, lat, lng, capacity, is_poi, poi_type FROM rooms ORDER BY block, code'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List rooms error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aula no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get room error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
