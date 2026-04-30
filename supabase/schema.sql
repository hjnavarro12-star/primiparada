create extension if not exists pgcrypto;

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null,
  faculty text
);

create table if not exists public.users (
  id uuid primary key references auth.users(id),
  email text not null,
  program_id uuid references public.programs(id),
  created_at timestamptz default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  block text not null,
  floor integer,
  lat double precision,
  lng double precision,
  capacity integer,
  is_poi boolean default false,
  poi_type text
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  subject text not null,
  teacher text,
  day_of_week integer not null,
  start_time time not null,
  end_time time not null,
  room_id uuid references public.rooms(id),
  semester text,
  created_at timestamptz default now()
);

create table if not exists public.schedule_sync_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  operation text not null,
  payload jsonb not null,
  synced_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.campus_geodata (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  geojson jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists public.notifications_config (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) unique,
  minutes_before integer default 30,
  sound_id text default 'default',
  vibration boolean default true,
  enabled boolean default true
);

alter table public.schedules enable row level security;
alter table public.notifications_config enable row level security;
alter table public.schedule_sync_queue enable row level security;
alter table public.rooms enable row level security;
alter table public.programs enable row level security;

drop policy if exists "users_own_schedules" on public.schedules;
create policy "users_own_schedules" on public.schedules
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users_own_notifications" on public.notifications_config;
create policy "users_own_notifications" on public.notifications_config
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users_own_queue" on public.schedule_sync_queue;
create policy "users_own_queue" on public.schedule_sync_queue
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "rooms_public_read" on public.rooms;
create policy "rooms_public_read" on public.rooms
  for select using (true);

drop policy if exists "programs_public_read" on public.programs;
create policy "programs_public_read" on public.programs
  for select using (true);