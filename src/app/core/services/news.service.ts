import { Injectable, inject, signal } from '@angular/core';

import { SupabaseClientService } from './supabase-client.service';
import { environment } from '../../../environments/environment';
import type { NewsItem } from '../../shared/models/news.model';

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'fallback-1',
    title: 'Bienvenidos a la Universidad del Pacífico',
    image_url: null,
    published_at: null,
    source_url: 'https://www.unipacifico.edu.co/'
  }
];

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly supabase = inject(SupabaseClientService);

  readonly news = signal<NewsItem[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  async loadNews(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const { data, error } = await this.supabase.client
        .from('news_cache')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(4);

      if (error) {
        // Tabla no existe o error de conexión — intentar Edge Function
        await this.tryEdgeFunction();
        return;
      }

      if (data && data.length > 0) {
        this.news.set(data as NewsItem[]);
      } else {
        // Tabla vacía — intentar Edge Function para poblarla
        await this.tryEdgeFunction();
      }
    } catch {
      this.news.set(FALLBACK_NEWS);
      this.error.set('Error de conexión al cargar noticias.');
    } finally {
      this.loading.set(false);
    }
  }

  private async tryEdgeFunction(): Promise<void> {
    try {
      const response = await fetch(
        `${environment.supabaseUrl}/functions/v1/scrape-news`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          this.news.set(data as NewsItem[]);
          return;
        }
      }
    } catch {
      // Edge Function no disponible — usar fallback silenciosamente
    }

    this.news.set(FALLBACK_NEWS);
  }
}
