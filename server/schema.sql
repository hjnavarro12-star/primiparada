create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  password_salt text not null,
  program_id uuid,
  created_at timestamptz default now()
);

create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null,
  faculty text
);

alter table users add constraint fk_users_program
  foreign key (program_id) references programs(id);

create table if not exists rooms (
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

create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  subject text not null,
  teacher text,
  day_of_week integer not null,
  start_time time not null,
  end_time time not null,
  room_id uuid references rooms(id),
  semester text,
  created_at timestamptz default now()
);

create table if not exists schedule_sync_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  operation text not null,
  payload jsonb not null,
  synced_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists campus_geodata (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  geojson jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists notifications_config (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade unique,
  minutes_before integer default 30,
  sound_id text default 'default',
  vibration boolean default true,
  enabled boolean default true
);

create index if not exists idx_schedules_user_id on schedules(user_id);
create index if not exists idx_schedule_sync_queue_user_id on schedule_sync_queue(user_id);
