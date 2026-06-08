const express = require('express');
const crypto = require('crypto');
const { pool } = require('../db');
const { signToken } = require('../auth');

const router = express.Router();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  const derived = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return derived === hash;
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, programId } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const { salt, hash } = hashPassword(password);
    const id = crypto.randomUUID();

    await pool.query(
      'INSERT INTO users (id, email, password_hash, password_salt, program_id) VALUES ($1, $2, $3, $4, $5)',
      [id, email, hash, salt, programId || null]
    );

    const token = signToken({ sub: id, email });
    res.status(201).json({ token, user: { id, email, program_id: programId } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const result = await pool.query(
      'SELECT id, email, password_hash, password_salt, program_id FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    if (!verifyPassword(password, user.password_salt, user.password_hash)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = signToken({ sub: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email, program_id: user.program_id } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const { verifyToken } = require('../auth');
    const payload = verifyToken(authHeader.split(' ')[1]);
    if (!payload) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const result = await pool.query(
      'SELECT id, email, program_id, created_at FROM users WHERE id = $1',
      [payload.sub]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
