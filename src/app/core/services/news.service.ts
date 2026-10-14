import { Injectable, inject, signal } from '@angular/core';

import { ApiService }  from './api.service';
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
  private readonly api = inject(ApiService);

  readonly news    = signal<NewsItem[]>([]);
  readonly loading = signal(true);
  readonly error   = signal('');

  async loadNews(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const data = await this.api.get<NewsItem[]>('/news');
      if (Array.isArray(data) && data.length > 0) {
        this.news.set(data);
      } else {
        // Backend sin datos — mostrar fallback
        this.news.set(FALLBACK_NEWS);
      }
    } catch {
      // Backend no disponible — mostrar fallback silenciosamente
      this.news.set(FALLBACK_NEWS);
      this.error.set('No se pudieron cargar las noticias.');
    } finally {
      this.loading.set(false);
    }
  }
}
