import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const projectRoot = process.cwd();
const schemaPath = path.join(projectRoot, 'supabase', 'schema.sql');
const environmentPath = path.join(projectRoot, 'src', 'environments', 'environment.ts');

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

describe('Supabase schema contract', () => {
  it('declares the expected tables', () => {
    const schema = readFile(schemaPath);

    expect(schema).toContain('create table if not exists public.programs');
    expect(schema).toContain('create table if not exists public.users');
    expect(schema).toContain('create table if not exists public.rooms');
    expect(schema).toContain('create table if not exists public.schedules');
    expect(schema).toContain('create table if not exists public.schedule_sync_queue');
    expect(schema).toContain('create table if not exists public.campus_geodata');
    expect(schema).toContain('create table if not exists public.notifications_config');
  });

  it('enables row level security for the protected tables', () => {
    const schema = readFile(schemaPath);

    expect(schema).toContain('alter table public.schedules enable row level security;');
    expect(schema).toContain('alter table public.notifications_config enable row level security;');
    expect(schema).toContain('alter table public.schedule_sync_queue enable row level security;');
    expect(schema).toContain('alter table public.rooms enable row level security;');
    expect(schema).toContain('alter table public.programs enable row level security;');
  });

  it('defines the expected policies', () => {
    const schema = readFile(schemaPath);

    expect(schema).toContain('create policy "users_own_schedules"');
    expect(schema).toContain('create policy "users_own_notifications"');
    expect(schema).toContain('create policy "users_own_queue"');
    expect(schema).toContain('create policy "rooms_public_read"');
    expect(schema).toContain('create policy "programs_public_read"');
  });

  it('exposes the Supabase URL in development environment', () => {
    const environment = readFile(environmentPath);

    expect(environment).toContain("supabaseUrl: 'https://xxqtmbptexnusrhitvnk.supabase.co'");
    expect(environment).toContain('supabaseAnonKey:');
  });
});
