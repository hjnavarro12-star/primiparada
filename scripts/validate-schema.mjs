import { Client } from 'pg';

import { readConnectionConfigFromEnv, resolveSupabaseConnection } from './supabase-connection.mjs';

async function validateSchema() {
  const envConfig = readConnectionConfigFromEnv();
  const resolvedConnection = await resolveSupabaseConnection(envConfig);
  let client;

  try {
    client = new Client({ connectionString: resolvedConnection.connectionString });
    console.log(`📦 Conectando a Supabase para validación por ${resolvedConnection.host}...\n`);
    await client.connect();
    console.log('✅ Conectado.\n');

    // Expected tables
    const expectedTables = [
      'programs',
      'users',
      'rooms',
      'schedules',
      'schedule_sync_queue',
      'campus_geodata',
      'notifications_config'
    ];

    // Check tables exist
    console.log('📋 Verificando tablas...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    const existingTables = tablesResult.rows.map(r => r.table_name);
    
    expectedTables.forEach(table => {
      const exists = existingTables.includes(table);
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    });

    // Check RLS status on tables with RLS
    console.log('\n🔐 Verificando RLS (Row Level Security) habilitado...');
    const rlsEnabledTables = [
      'schedules',
      'notifications_config',
      'schedule_sync_queue',
      'rooms',
      'programs'
    ];

    for (const table of rlsEnabledTables) {
      const result = await client.query(`
        SELECT rowsecurity FROM pg_class 
        WHERE relname = $1 AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
      `, [table]);
      const rlsEnabled = result.rows[0]?.rowsecurity;
      console.log(`  ${rlsEnabled ? '✅' : '❌'} ${table} - RLS ${rlsEnabled ? 'habilitado' : 'DESHABILITADO'}`);
    }

    // Check policies
    console.log('\n📌 Verificando políticas RLS...');
    const policiesResult = await client.query(`
      SELECT schemaname, tablename, policyname 
      FROM pg_policies 
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `);
    
    if (policiesResult.rows.length === 0) {
      console.log('  ❌ No se encontraron políticas RLS.');
    } else {
      const policiesByTable = {};
      policiesResult.rows.forEach(row => {
        if (!policiesByTable[row.tablename]) {
          policiesByTable[row.tablename] = [];
        }
        policiesByTable[row.tablename].push(row.policyname);
      });

      Object.entries(policiesByTable).forEach(([table, policies]) => {
        console.log(`  📊 ${table}:`);
        policies.forEach(policy => console.log(`    - ${policy}`));
      });
    }

    // Expected policies
    console.log('\n✨ Validación de políticas esperadas...');
    const expectedPolicies = {
      'schedules': ['users_own_schedules'],
      'notifications_config': ['users_own_notifications'],
      'schedule_sync_queue': ['users_own_queue'],
      'rooms': ['rooms_public_read'],
      'programs': ['programs_public_read']
    };

    let allPoliciesOk = true;
    Object.entries(expectedPolicies).forEach(([table, policies]) => {
      policies.forEach(policy => {
        const exists = policiesResult.rows.some(r => r.tablename === table && r.policyname === policy);
        console.log(`  ${exists ? '✅' : '❌'} ${table}.${policy}`);
        if (!exists) allPoliciesOk = false;
      });
    });

    if (allPoliciesOk && existingTables.length === expectedTables.length) {
      console.log('\n🎉 ¡PBI-02 COMPLETADO! Todas las tablas y políticas RLS están activas.\n');
    } else {
      console.log('\n⚠️  Algunas validaciones fallaron. Revisa arriba.\n');
    }

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
      console.log('🔌 Desconectado.\n');
    }
  }
}

validateSchema();
