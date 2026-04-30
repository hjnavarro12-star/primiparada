import { describe, expect, it, vi } from 'vitest';

import {
  buildConnectionString,
  parseConnectionCandidates,
  readConnectionConfigFromEnv,
  resolveSupabaseConnection,
} from './supabase-connection.mjs';

describe('supabase-connection helpers', () => {
  it('parses fallback hosts from a comma-separated string', () => {
    expect(parseConnectionCandidates(' one.example.com , two.example.com ,, ')).toEqual([
      'one.example.com',
      'two.example.com',
    ]);
  });

  it('builds a postgres connection string with SSL enabled', () => {
    const connectionString = buildConnectionString({
      host: 'db.example.com',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'Secret#123',
    });

    expect(connectionString).toBe(
      'postgresql://postgres:Secret%23123@db.example.com:5432/postgres?sslmode=require',
    );
  });

  it('reads connection config from environment variables', () => {
    const config = readConnectionConfigFromEnv({
      SUPABASE_DB_HOST: 'db.one.example.com',
      SUPABASE_DB_FALLBACK_HOSTS: 'db.two.example.com,db.three.example.com',
      SUPABASE_DB_PORT: '6543',
      SUPABASE_DB_NAME: 'appdb',
      SUPABASE_DB_USER: 'admin',
      SUPABASE_DB_PASSWORD: 'password',
      SUPABASE_DB_SSL: 'false',
      SUPABASE_DB_TIMEOUT_MS: '1000',
      SUPABASE_DB_RETRIES: '4',
      SUPABASE_DB_RETRY_DELAY_MS: '250',
    });

    expect(config).toEqual({
      primaryHost: 'db.one.example.com',
      fallbackHosts: ['db.two.example.com', 'db.three.example.com'],
      port: 6543,
      database: 'appdb',
      user: 'admin',
      password: 'password',
      ssl: false,
      timeoutMs: 1000,
      maxRetries: 4,
      retryDelayMs: 250,
    });
  });

  it('retries each host before falling back to the next candidate', async () => {
    const probes = {
      resolveHost: vi.fn(async (host) => [`1.2.3.${host.length}`]),
      canReachTcpHost: vi.fn(async (host) => host === 'second.example.com'),
    };

    await expect(
      resolveSupabaseConnection({
        primaryHost: 'first.invalid.example.com',
        fallbackHosts: ['second.example.com'],
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'password',
        timeoutMs: 5,
        maxRetries: 2,
        retryDelayMs: 0,
        probes,
      }),
    ).resolves.toMatchObject({
      host: 'second.example.com',
      attempts: [
        expect.objectContaining({ host: 'first.invalid.example.com', attemptNumber: 1, reachable: false }),
        expect.objectContaining({ host: 'first.invalid.example.com', attemptNumber: 2, reachable: false }),
        expect.objectContaining({ host: 'second.example.com', attemptNumber: 1, reachable: true }),
      ],
    });

    expect(probes.resolveHost).toHaveBeenCalledTimes(3);
    expect(probes.canReachTcpHost).toHaveBeenCalledTimes(3);
  });
});
