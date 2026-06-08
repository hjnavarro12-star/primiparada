const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.user_id, s.subject, s.teacher, s.day_of_week,
              s.start_time, s.end_time, s.room_id, r.code as room_label,
              s.semester, s.created_at
       FROM schedules s
       LEFT JOIN rooms r ON s.room_id = r.id
       WHERE s.user_id = $1
       ORDER BY s.day_of_week, s.start_time`,
      [req.user.sub]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List schedules error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { subject, teacher, day_of_week, start_time, end_time, room_id, semester } = req.body;
    const id = crypto.randomUUID();

    const result = await pool.query(
      `INSERT INTO schedules (id, user_id, subject, teacher, day_of_week, start_time, end_time, room_id, semester)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, req.user.sub, subject, teacher || null, day_of_week, start_time, end_time, room_id || null, semester || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create schedule error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { subject, teacher, day_of_week, start_time, end_time, room_id, semester } = req.body;

    const result = await pool.query(
      `UPDATE schedules
       SET subject = COALESCE($1, subject),
           teacher = COALESCE($2, teacher),
           day_of_week = COALESCE($3, day_of_week),
           start_time = COALESCE($4, start_time),
           end_time = COALESCE($5, end_time),
           room_id = COALESCE($6, room_id),
           semester = COALESCE($7, semester)
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [subject, teacher, day_of_week, start_time, end_time, room_id, semester, req.params.id, req.user.sub]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update schedule error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM schedules WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.sub]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.json({ deleted: true });
  } catch (err) {
    console.error('Delete schedule error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/sync', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { upserts = [], deletions = [] } = req.body;

    for (const s of upserts) {
      await client.query(
        `INSERT INTO schedules (id, user_id, subject, teacher, day_of_week, start_time, end_time, room_id, semester)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           subject = EXCLUDED.subject, teacher = EXCLUDED.teacher,
           day_of_week = EXCLUDED.day_of_week, start_time = EXCLUDED.start_time,
           end_time = EXCLUDED.end_time, room_id = EXCLUDED.room_id, semester = EXCLUDED.semester`,
        [s.id || crypto.randomUUID(), req.user.sub, s.subject, s.teacher || null,
         s.day_of_week, s.start_time, s.end_time, s.room_id || null, s.semester || null]
      );
    }

    if (deletions.length > 0) {
      await client.query(
        'DELETE FROM schedules WHERE id = ANY($1) AND user_id = $2',
        [deletions, req.user.sub]
      );
    }

    await client.query(
      `INSERT INTO schedule_sync_queue (id, user_id, operation, payload, synced_at)
       VALUES ($1, $2, 'sync_schedule_changes', $3, NOW())`,
      [crypto.randomUUID(), req.user.sub, JSON.stringify({ upsert_count: upserts.length, delete_count: deletions.length })]
    );

    await client.query('COMMIT');
    res.json({ synced: true, upserts: upserts.length, deletions: deletions.length });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Sync schedules error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

module.exports = router;
