/**
 * scrape-news.js — Scraper de noticias institucionales
 * Reemplaza la Edge Function "rapid-worker" de Supabase.
 * Extrae las 4 noticias más recientes de unipacifico.edu.co
 * y las guarda en la tabla news_cache del PostgreSQL local.
 *
 * Lógica idéntica a la Edge Function original:
 *   1. GET /noticias → extraer URLs /noticia/ con regex
 *   2. GET individual por artículo → <h1> + background-image (kingster-feature-image)
 *   3. UPSERT en news_cache (ON CONFLICT DO NOTHING)
 */

const { pool } = require('../db');

const BASE_URL = 'https://www.unipacifico.edu.co';
const NOTICIAS_URL = `${BASE_URL}/noticias`;
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas

/**
 * Verifica si el cache está vigente (< 12 horas desde el último scraping).
 */
async function isCacheValid() {
  try {
    const result = await pool.query(
      "SELECT scraped_at FROM news_cache ORDER BY scraped_at DESC LIMIT 1"
    );
    if (!result.rows.length) return false;
    const lastScrape = new Date(result.rows[0].scraped_at).getTime();
    return (Date.now() - lastScrape) < CACHE_TTL_MS;
  } catch {
    return false;
  }
}

/**
 * Extrae las URLs de los artículos individuales desde la página de noticias.
 */
async function extractArticleUrls(html) {
  const urlRegex = /href="(\/noticia\/\d+\/[^"]+)"/g;
  const matches = new Set();
  let match;
  while ((match = urlRegex.exec(html)) !== null) {
    matches.add(match[1]);
    if (matches.size >= 4) break;
  }
  return [...matches];
}

/**
 * Extrae el título y la imagen de un artículo individual.
 */
async function scrapeArticle(relativeUrl) {
  const url = `${BASE_URL}${relativeUrl}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PrimiparadaBot/1.0)' }
    });
    if (!res.ok) return null;

    const html = await res.text();

    // Título: buscar en <h1>
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const title = titleMatch
      ? titleMatch[1].trim().replace(/\s+/g, ' ')
      : 'Noticia sin título';

    // Imagen: background-image en div.kingster-feature-image
    const imgMatch = html.match(/kingster-feature-image[^>]*style="[^"]*background-image:\s*url\(\s*([^)]+)\s*\)/i);
    let image_url = null;
    if (imgMatch) {
      image_url = imgMatch[1].trim().replace(/['"]/g, '');
      if (!image_url.startsWith('http')) {
        image_url = `${BASE_URL}${image_url}`;
      }
    }

    // Fecha publicación: meta tag
    const dateMatch = html.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]+)"/i);
    const published_at = dateMatch ? dateMatch[1] : null;

    return { title, image_url, published_at, source_url: url };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Función principal: scraping completo y guardado en BD.
 * Exportada para poder llamarla manualmente desde index.js al arrancar.
 */
async function runScrapeNews() {
  try {
    // Verificar si el cache sigue siendo válido
    if (await isCacheValid()) {
      console.log('[scrape-news] Cache vigente, omitiendo scraping.');
      return;
    }

    console.log('[scrape-news] Iniciando scraping de noticias...');

    // Paso 1: obtener página de noticias
    const res = await fetch(NOTICIAS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PrimiparadaBot/1.0)' },
      signal: AbortSignal.timeout(15000)
    });

    if (!res.ok) {
      console.error(`[scrape-news] Error al obtener noticias: ${res.status}`);
      return;
    }

    const html = await res.text();
    const urls = await extractArticleUrls(html);

    if (!urls.length) {
      console.warn('[scrape-news] No se encontraron URLs de artículos.');
      return;
    }

    // Paso 2: scraping paralelo de artículos individuales
    const articles = (
      await Promise.all(urls.map(url => scrapeArticle(url)))
    ).filter(Boolean);

    if (!articles.length) {
      console.warn('[scrape-news] No se pudo extraer ningún artículo.');
      return;
    }

    // Paso 3: guardar en BD (DELETE + INSERT para reemplazar el cache)
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM news_cache');
      for (const article of articles) {
        await client.query(
          `INSERT INTO news_cache (title, image_url, published_at, source_url, scraped_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [article.title, article.image_url, article.published_at, article.source_url]
        );
      }
      await client.query('COMMIT');
      console.log(`[scrape-news] ${articles.length} noticias guardadas correctamente.`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[scrape-news] Error guardando en BD:', err.message);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[scrape-news] Error inesperado:', err.message);
  }
}

module.exports = { runScrapeNews };
