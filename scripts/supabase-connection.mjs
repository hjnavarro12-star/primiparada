import dns from 'node:dns/promises';
import net from 'node:net';

export const defaultConnectionProbes = {
  resolveHost,
  canReachTcpHost,
};

export function parseConnectionCandidates(input = '') {
  return input
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export function buildConnectionString({ host, port, database, user, password, ssl = true }) {
  if (!host || !database || !user || !password) {
    throw new Error('Faltan datos obligatorios para construir la conexión a Supabase.');
  }

  const credentials = `${encodeURIComponent(user)}:${encodeURIComponent(password)}`;
  const query = ssl ? '?sslmode=require' : '';

  return `postgresql://${credentials}@${host}:${port}/${database}${query}`;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function resolveHost(host) {
  const result = await dns.lookup(host, { all: true });
  return result.map((entry) => entry.address);
}

export async function canReachTcpHost(host, port, timeoutMs = 2500) {
  return await new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    let settled = false;

    const done = (value) => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(value);
      }
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

export async function resolveSupabaseConnection(options) {
  const {
    primaryHost,
    fallbackHosts = [],
    port = 5432,
    database = 'postgres',
    user = 'postgres',
    password,
    ssl = true,
    timeoutMs = 2500,
    maxRetries = 3,
    retryDelayMs = 500,
  } = options;

  const hosts = [primaryHost, ...fallbackHosts].filter(Boolean);

  if (hosts.length === 0) {
    throw new Error('No se proporcionó ningún host de Supabase.');
  }

  const probes = options.probes || defaultConnectionProbes;
  const attempts = [];

  for (const host of hosts) {
    for (let attemptNumber = 1; attemptNumber <= maxRetries; attemptNumber += 1) {
      try {
        const addresses = await probes.resolveHost(host);
        const reachable = await probes.canReachTcpHost(host, port, timeoutMs);

        attempts.push({ host, attemptNumber, addresses, reachable });

        if (reachable) {
          return {
            host,
            addresses,
            connectionString: buildConnectionString({ host, port, database, user, password, ssl }),
            attempts,
          };
        }

        if (attemptNumber < maxRetries) {
          await sleep(retryDelayMs * attemptNumber);
        }
      } catch (error) {
        attempts.push({ host, attemptNumber, error: error.message, reachable: false });

        if (attemptNumber < maxRetries) {
          await sleep(retryDelayMs * attemptNumber);
        }
      }
    }
  }

  const error = new Error(`No se pudo resolver ni conectar con ninguno de los hosts de Supabase: ${hosts.join(', ')}`);
  error.attempts = attempts;
  throw error;
}

export function readConnectionConfigFromEnv(env = process.env) {
  return {
    primaryHost: env.SUPABASE_DB_HOST || 'db.xxqtmbptexnusrhitvnk.supabase.co',
    fallbackHosts: parseConnectionCandidates(env.SUPABASE_DB_FALLBACK_HOSTS),
    port: Number(env.SUPABASE_DB_PORT || 5432),
    database: env.SUPABASE_DB_NAME || 'postgres',
    user: env.SUPABASE_DB_USER || 'postgres',
    password: env.SUPABASE_DB_PASSWORD,
    ssl: env.SUPABASE_DB_SSL !== 'false',
    timeoutMs: Number(env.SUPABASE_DB_TIMEOUT_MS || 2500),
    maxRetries: Number(env.SUPABASE_DB_RETRIES || 3),
    retryDelayMs: Number(env.SUPABASE_DB_RETRY_DELAY_MS || 500),
  };
}
