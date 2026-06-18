// @ts-nocheck
// Esta función corre en Deno (Supabase Edge Functions), no en Node/Angular.
// Los imports de URL y Deno.* son válidos en ese entorno.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas
const NEWS_PAGE_URL = "https://www.unipacifico.edu.co/noticias";
const BASE_DOMAIN = "https://www.unipacifico.edu.co";
const MAX_NEWS = 4;
const FETCH_TIMEOUT = 10000;

interface NewsItem {
  title: string;
  image_url: string | null;
  published_at: string | null;
  source_url: string;
  scraped_at: string;
}

function extractArticleUrls(html: string): string[] {
  const hrefRegex = /href=["'](https?:\/\/www\.unipacifico\.edu\.co\/[a-z0-9\-\/]+)["']/gi;
  const matches = [...html.matchAll(hrefRegex)];
  const urls = matches
    .map((m) => m[1])
    .filter((url) => {
      if (url === BASE_DOMAIN || url === BASE_DOMAIN + "/") return false;
      if (url.endsWith("/noticias") || url.endsWith("/noticias/")) return false;
      if (url.includes("#") || url.includes("?")) return false;
      if (url.includes("/noticia/")) return true;
      const path = url.replace(BASE_DOMAIN, "");
      return path.split("-").length >= 3;
    })
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, MAX_NEWS * 2);
  return urls;
}

async function extractArticleMetadata(url: string): Promise<NewsItem | null> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PrimiparadaBot/1.0)" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });
    if (!response.ok) return null;
    const html = await response.text();

    // Extraer título
    let title: string | null = null;

    const ogTitleMatch =
      html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
    if (ogTitleMatch && ogTitleMatch[1].length > 15 && !ogTitleMatch[1].includes("::")) {
      title = ogTitleMatch[1];
    }

    if (!title) {
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
        html.match(/<h1[^>]*>\s*<[^>]+>([^<]+)<\/[^>]+>\s*<\/h1>/i);
      if (h1Match && h1Match[1].trim().length > 10) {
        title = h1Match[1].trim();
      }
    }

    if (!title) {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) {
        let rawTitle = titleMatch[1].trim();
        rawTitle = rawTitle.replace(/\.?::\s*Universidad del Pac[ií]fico[^:]*::\s*/gi, "").trim();
        rawTitle = rawTitle.replace(/\s*[-|]\s*Universidad del Pac[ií]fico.*/gi, "").trim();
        if (rawTitle.length > 10) {
          title = rawTitle;
        }
      }
    }

    if (!title) return null;

    // Extraer imagen
    let imageUrl: string | null = null;

    const bgImageMatch = html.match(/kingster-feature-image[^>]*style=["'][^"']*background-image:\s*url\(\s*(https?:\/\/[^\s\)]+)\s*\)/i);
    if (bgImageMatch) {
      imageUrl = bgImageMatch[1].trim();
    }

    if (!imageUrl) {
      const ogImageMatch =
        html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
      if (ogImageMatch && ogImageMatch[1].startsWith("http") && !ogImageMatch[1].includes("wlqYSgBs")) {
        imageUrl = ogImageMatch[1];
      }
    }

    if (!imageUrl) {
      const imgMatches = html.match(/<img[^>]*src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi);
      if (imgMatches && imgMatches.length > 0) {
        for (const imgTag of imgMatches) {
          const srcMatch = imgTag.match(/src=["'](https?:\/\/[^"']+)["']/i);
          if (srcMatch) {
            const src = srcMatch[1];
            if (!src.includes("logo") && !src.includes("icon") && !src.includes("favicon") && !src.includes("/themes/") && !src.includes("wlqYSgBs")) {
              imageUrl = src;
              break;
            }
          }
        }
      }
    }

    // Extraer fecha
    let publishedAt: string | null = null;
    const dateMatch =
      html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']article:published_time["']/i) ||
      html.match(/<meta[^>]*property=["']og:updated_time["'][^>]*content=["']([^"']+)["']/i);
    if (dateMatch) {
      publishedAt = dateMatch[1];
    }

    if (!publishedAt) {
      const dateTextMatch = html.match(/(\d{1,2}\s+(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*\.?\s+\d{4})/i) ||
        html.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateTextMatch) {
        publishedAt = dateTextMatch[1];
      }
    }

    return {
      title: title.trim(),
      image_url: imageUrl,
      published_at: publishedAt,
      source_url: url,
      scraped_at: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

Deno.serve(async () => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: cached } = await supabase
      .from("news_cache")
      .select("*")
      .order("scraped_at", { ascending: false })
      .limit(1);

    if (cached && cached.length > 0) {
      const lastScrape = new Date(cached[0].scraped_at).getTime();
      if (Date.now() - lastScrape < CACHE_TTL_MS) {
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

    const newsPageHtml = await fetch(NEWS_PAGE_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PrimiparadaBot/1.0)" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    }).then((r) => r.text());

    const articleUrls = extractArticleUrls(newsPageHtml);

    if (articleUrls.length === 0) {
      const { data: existing } = await supabase
        .from("news_cache")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(MAX_NEWS);
      return new Response(JSON.stringify(existing ?? []), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = await Promise.allSettled(
      articleUrls.slice(0, MAX_NEWS + 2).map(extractArticleMetadata)
    );

    const news: NewsItem[] = results
      .filter((r): r is PromiseFulfilledResult<NewsItem | null> => r.status === "fulfilled")
      .map((r) => r.value)
      .filter((item): item is NewsItem => item !== null)
      .slice(0, MAX_NEWS);

    if (news.length === 0) {
      const { data: existing } = await supabase
        .from("news_cache")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(MAX_NEWS);
      return new Response(JSON.stringify(existing ?? []), {
        headers: { "Content-Type": "application/json" },
      });
    }

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
