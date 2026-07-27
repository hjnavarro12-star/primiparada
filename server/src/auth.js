const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || crypto.randomBytes(64).toString('hex');

function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const body = Buffer.from(JSON.stringify({
    ...payload,
    iat: now,
    exp: now + 7 * 24 * 60 * 60,
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;

    // Verificar firma con JWT_SECRET (soporta tokens propios y de Supabase)
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expected) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Token invalido o expirado' });
  }
  // Supabase tokens usan 'sub' para el user ID y 'user_metadata' para roles
  req.user = {
    sub: payload.sub,
    email: payload.email,
    role: payload.user_metadata?.role || payload.role || 'standard'
  };
  next();
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
}

module.exports = { signToken, verifyToken, authMiddleware, adminMiddleware };
