import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.47/deno-dom-wasm.ts";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas
const SOURCE_URL = "https://www.unipacifico.edu.co/";
const MAX_NEWS = 4;

interface NewsItem {
  title: string;
  image_url: string | null;
  published_at: string | null;
  source_url: string;
  scraped_at: string;
}

Deno.serve(async (_req: Request) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verificar cache
    const { data: cached } = await supabase
      .from("news_cache")
      .select("*")
      .order("scraped_at", { ascending: false })
      .limit(1);

    if (cached && cached.length > 0) {
      const lastScrape = new Date(cached[0].scraped_at).getTime();
      const isStale = Date.now() - lastScrape > CACHE_TTL_MS;

      if (!isStale) {
        // Cache vigente — retornar datos existentes
        const { data: allCached } = await supabase
          .from("news_cache")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(MAX_NEWS);

        return new Response(JSON.stringify(allCached ?? []), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Scraping
    const html = await fetch(SOURCE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10000),
    }).then((r) => r.text());

    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc) {
      return new Response(JSON.stringify({ error: "No se pudo parsear el HTML" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Intentar extraer del bloque de noticias (gdlr-core-blog-widget)
    const news: NewsItem[] = [];
    const now = new Date().toISOString();

    // Estrategia 1: buscar enlaces de noticias dentro del blog widget
    const blogItems = doc.querySelectorAll(".gdlr-core-blog-title a");

    if (blogItems && blogItems.length > 0) {
      for (const link of Array.from(blogItems).slice(0, MAX_NEWS)) {
        const el = link as unknown as { textContent: string; getAttribute: (attr: string) => string | null };
        const title = el.textContent?.trim() || "";
        const href = el.getAttribute("href") || SOURCE_URL;

        // Buscar imagen cercana (en el padre del widget)
        let imageUrl: string | null = null;
        const parent = (link as unknown as { closest: (sel: string) => unknown }).closest?.(".gdlr-core-blog-widget");
        if (parent) {
          const img = (parent as unknown as { querySelector: (sel: string) => unknown }).querySelector?.("img");
          if (img) {
            imageUrl = (img as unknown as { getAttribute: (attr: string) => string | null }).getAttribute("src") || null;
          }
        }

        if (title) {
          news.push({
            title,
            image_url: imageUrl,
            published_at: null,
            source_url: href,
            scraped_at: now,
          });
        }
      }
    }

    // Estrategia 2: fallback — buscar cualquier link con /noticias/ en el href
    if (news.length === 0) {
      const allLinks = doc.querySelectorAll('a[href*="/noticias/"]');
      for (const link of Array.from(allLinks).slice(0, MAX_NEWS)) {
        const el = link as unknown as { textContent: string; getAttribute: (attr: string) => string | null };
        const title = el.textContent?.trim() || "";
        const href = el.getAttribute("href") || SOURCE_URL;

        if (title && title.length > 10) {
          news.push({
            title,
            image_url: null,
            published_at: null,
            source_url: href,
            scraped_at: now,
          });
        }
      }
    }

    // Si no se encontró nada, retornar vacío sin actualizar cache
    if (news.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Limpiar cache viejo y guardar nuevos datos
    await supabase.from("news_cache").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("news_cache").insert(news);

    return new Response(JSON.stringify(news), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
