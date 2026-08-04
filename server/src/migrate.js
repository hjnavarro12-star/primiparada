/**
 * Migración idempotente ejecutada al arrancar el servidor.
 * Crea tablas si no existen y hace seed de datos base.
 * ON CONFLICT DO NOTHING garantiza que es seguro correr múltiples veces.
 */
const { pool } = require('./db');

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('[migrate] Iniciando migración idempotente...');

    await client.query('BEGIN');

    // Extensión necesaria para gen_random_uuid()
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    // ── SCHEMA ──────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        faculty TEXT
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL,
        program_id UUID,
        password_hash TEXT,
        password_salt TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT NOT NULL,
        block TEXT NOT NULL,
        floor INTEGER,
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        capacity INTEGER,
        is_poi BOOLEAN DEFAULT FALSE,
        poi_type TEXT
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        subject TEXT NOT NULL,
        teacher TEXT,
        day_of_week INTEGER NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        room_id UUID,
        semester TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS schedule_sync_queue (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        operation TEXT NOT NULL,
        payload JSONB NOT NULL,
        synced_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS campus_geodata (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        geojson JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications_config (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE,
        minutes_before INTEGER DEFAULT 30,
        sound_id TEXT DEFAULT 'default',
        vibration BOOLEAN DEFAULT TRUE,
        enabled BOOLEAN DEFAULT TRUE
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS news_cache (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        image_url TEXT,
        published_at TIMESTAMPTZ,
        source_url TEXT NOT NULL,
        scraped_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // ── SEED — 10 programas académicos UnPa ─────────────────────────
    await client.query(`
      INSERT INTO programs (id, name, code, faculty) VALUES
        ('c77c21c5-8c3e-409b-9f58-892b5bce0874', 'Ingenieria de Sistemas',        'IS',  'Ingenieria'),
        ('20ae6ca0-ba4b-4979-82cb-7aa88b01623a', 'Administracion de Empresas',    'AE',  'Ciencias Economicas'),
        ('76a7615b-a163-42b5-a607-95e4357f9bb5', 'Contaduria Publica',            'CP',  'Ciencias Economicas'),
        ('e3a484e5-dc9d-47f9-b385-6b6b0aa86a2f', 'Trabajo Social',               'TS',  'Humanidades'),
        ('dbfdd116-0645-47b1-9ebe-8893cad3b411', 'Sociologia',                   'SOC', 'Humanidades'),
        ('2378f1fe-6dd6-473b-9482-afc75937abf5', 'Arquitectura',                 'ARQ', 'Ingenieria'),
        ('fe3f1a32-7934-4533-a814-e5852ce01a7e', 'Tecnologia en Gestion Hotelera','TGH','Turismo'),
        ('4ab2a078-a268-472e-bff8-920c969fa3bc', 'Biologia',                     'BIO', 'Ciencias Naturales'),
        ('710d4511-428e-4466-b6c1-dfac5c715420', 'Agronomia',                    'AGR', 'Ciencias Naturales'),
        ('020411b1-f390-4d73-99e1-fed2ce2a7940', 'Derecho',                      'DER', 'Derecho')
      ON CONFLICT (id) DO NOTHING
    `);

    // ── SEED — usuarios de prueba (perfil público, auth en Supabase) ─
    // Agregar columnas de password si la tabla ya existía sin ellas
    await client.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS password_hash TEXT,
        ADD COLUMN IF NOT EXISTS password_salt TEXT
    `);
    await client.query(`
      INSERT INTO users (id, email, program_id, created_at) VALUES
        ('7255f129-6aa1-4ce4-b152-b2289cd0c8a1', 'hjnavarro@unipacifico.edu.co',  NULL, '2026-07-28T18:51:15.631582+00:00'),
        ('5b04fd58-71d9-4c2a-8d92-30e017ecd5cd', 'marulanda@unipacifico.edu.co',  NULL, '2026-07-28T18:51:15.631582+00:00')
      ON CONFLICT (id) DO NOTHING
    `);

    // ── SEED — noticias exportadas de Supabase ───────────────────────
    await client.query(`
      INSERT INTO news_cache (id, title, image_url, published_at, source_url, scraped_at) VALUES
        ('c8297a66-73eb-4a25-ba90-b6f4818e8512',
         'SEMANA ECO LETRAS UNIPACIFICO FORO TERRITORIO SOSTENIBLE',
         'https://www.unipacifico.edu.co/storage/GpkkjwFU.JPG',
         NULL,
         'https://www.unipacifico.edu.co/noticia/1058/semana-eco-letras-unipacifico-foro-territorio-sostenible',
         '2026-07-26T23:24:32.179+00:00'),
        ('53517366-a784-4252-a8d2-22da0636ed20',
         'ESTUDIANTES DE ULTIMOS SEMESTRES RECIBEN CAPACITACION COPNIA',
         'https://www.unipacifico.edu.co/storage/SR5bbTvn.jpg',
         NULL,
         'https://www.unipacifico.edu.co/noticia/1057/estudiantes-de-ultimos-semestres-reciben-capacitacion',
         '2026-07-26T23:24:32.256+00:00'),
        ('52023e06-1cd9-462d-8df0-5595f311fc79',
         'UNIVERSIDAD DEL PACIFICO FORTALECE ALIANZAS CON EL ICA',
         'https://www.unipacifico.edu.co/storage/yR0cxLQz.jpg',
         NULL,
         'https://www.unipacifico.edu.co/noticia/1056/universidad-del-pacifico-fortalece-alianzas',
         '2026-07-26T23:24:32.102+00:00'),
        ('731ddbc4-7ab4-41ab-acba-2bc060df0093',
         'LA UNIVERSIDAD DEL PACIFICO HA GRADUADO NUEVOS PROFESIONALES',
         'https://www.unipacifico.edu.co/storage/cEKB37kM.jpg',
         NULL,
         'https://www.unipacifico.edu.co/noticia/1055/la-universidad-del-pacifico-omar-barona-murillo-ha-graduado',
         '2026-07-26T23:24:32.257+00:00')
      ON CONFLICT (id) DO NOTHING
    `);

    await client.query('COMMIT');

    // Verificación final
    const result = await client.query(
      "SELECT tablename FROM information_schema.tables WHERE table_schema='public' ORDER BY tablename"
    );
    console.log('[migrate] Tablas presentes:', result.rows.map(r => r.tablename).join(', '));

    const progCount = await client.query('SELECT COUNT(*) FROM programs');
    console.log(`[migrate] programs: ${progCount.rows[0].count} filas`);

    console.log('[migrate] Migración completada exitosamente.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[migrate] Error durante migración:', err.message);
    // No lanzar el error — el servidor debe arrancar aunque la migración falle
  } finally {
    client.release();
  }
}

module.exports = { runMigrations };
