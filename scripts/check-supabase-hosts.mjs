import { readConnectionConfigFromEnv, resolveSupabaseConnection } from './supabase-connection.mjs';

async function main() {
  const envConfig = readConnectionConfigFromEnv();

  try {
    const result = await resolveSupabaseConnection(envConfig);

    console.log('✅ Host seleccionado:', result.host);
    console.log('✅ Direcciones resueltas:', result.addresses.join(', '));
    console.log('✅ Cadena de conexión lista.');
  } catch (error) {
    console.error('❌ No se pudo resolver ningún host de Supabase.');
    console.error(error.message);

    if (error.attempts?.length) {
      console.error('🔎 Intentos realizados:');
      for (const attempt of error.attempts) {
        console.error(`  - ${attempt.host}: ${attempt.reachable ? 'alcanzable' : 'no disponible'}`);
      }
    }

    process.exit(1);
  }
}

main();
