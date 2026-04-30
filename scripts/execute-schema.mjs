import fs from 'node:fs';
import path from 'node:path';

import { Client } from 'pg';

import { readConnectionConfigFromEnv, resolveSupabaseConnection } from './supabase-connection.mjs';

const schemaFile = path.join(process.cwd(), 'supabase', 'schema.sql');

async function executeSchema() {
  const envConfig = readConnectionConfigFromEnv();
  const resolvedConnection = await resolveSupabaseConnection(envConfig);
  let client;

  try {
    client = new Client({ connectionString: resolvedConnection.connectionString });
    console.log(`📦 Conectando a Supabase por ${resolvedConnection.host}...`);
    await client.connect();
    console.log('✅ Conectado exitosamente.');

    console.log('\n📖 Leyendo schema.sql...');
    const sql = fs.readFileSync(schemaFile, 'utf-8');
    console.log(`✅ Schema cargado (${sql.length} caracteres).`);

    console.log('\n🚀 Ejecutando schema.sql...');
    await client.query(sql);
    console.log('✅ Schema ejecutado exitosamente.');

    console.log('\n📋 Listando tablas creadas...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('\n📊 Tablas en schema public:');
    result.rows.forEach(row => console.log(`  - ${row.table_name}`));

    console.log('\n✨ PBI-02 completado: Schema de Supabase ejecutado exitosamente.');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.attempts) {
      console.error('🔎 Intentos realizados:');
      error.attempts.forEach((attempt) => {
        console.error(`  - ${attempt.host}: ${attempt.reachable ? 'alcanzable' : 'no disponible'}`);
      });
    }
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
      console.log('\n🔌 Desconectado de base de datos.');
    }
  }
}

executeSchema();
