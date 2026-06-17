import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonRow,
  IonSkeletonText
} from '@ionic/angular/standalone';

import { NewsService } from '../../core/services/news.service';
import type { NewsItem } from '../../shared/models/news.model';

@Component({
  selector: 'app-v1-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonSkeletonText
  ],
  template: `
    <ion-content class="ion-padding" scroll-y="true">
      <!-- Hero con gradiente -->
      <section class="hero">
        <div class="hero-content">
          <h1>Bienvenido a Primiparada</h1>
          <p>Tu guía en el campus universitario. Encuentra tus clases, navega por la universidad y nunca llegues tarde.</p>
        </div>
      </section>

      <!-- Acciones principales -->
      <section class="actions-section">
        <ion-button expand="block" fill="solid" routerLink="/access/v2" class="action-btn action-btn--primary">
          Iniciar sesión
        </ion-button>
        <ion-button expand="block" fill="solid" routerLink="/access/v3" class="action-btn action-btn--secondary">
          Registrarse
        </ion-button>
      </section>

      <!-- Contenido informativo -->
      <ion-grid class="content-grid">
        <ion-row>
          <!-- Video -->
          <ion-col size="12" size-md="7">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Video introductorio</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <div class="video-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/_UQy3b1f3-w"
                    title="Video introductorio de la Universidad del Pacífico"
                    frameborder="0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Noticias -->
          <ion-col size="12" size-md="5">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Noticias UnPa</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                @if (newsLoading()) {
                  <ion-skeleton-text [animated]="true" style="height: 20px; width: 80%; margin-bottom: 8px"></ion-skeleton-text>
                  <ion-skeleton-text [animated]="true" style="height: 20px; width: 60%; margin-bottom: 8px"></ion-skeleton-text>
                  <ion-skeleton-text [animated]="true" style="height: 20px; width: 70%"></ion-skeleton-text>
                } @else if (newsItems().length > 0) {
                  <div class="news-list">
                    @for (item of newsItems(); track item.id) {
                      <a class="news-item" [href]="item.source_url" target="_blank" rel="noopener">
                        @if (item.image_url) {
                          <img [src]="item.image_url" [alt]="item.title" class="news-img" />
                        }
                        <div class="news-meta">
                          <strong>{{ item.title }}</strong>
                          @if (item.published_at) {
                            <small>{{ item.published_at }}</small>
                          }
                        </div>
                      </a>
                    }
                  </div>
                  <a class="news-more" href="https://www.unipacifico.edu.co/noticias" target="_blank" rel="noopener">
                    Ver más noticias →
                  </a>
                } @else {
                  <p class="news-fallback">Visita <a href="https://www.unipacifico.edu.co/noticias" target="_blank" rel="noopener">unipacifico.edu.co</a> para las últimas noticias.</p>
                }
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
  styles: [`
    ion-content {
      --background: linear-gradient(160deg, #0a709c 0%, #3fa779 40%, #f4f8fb 70%);
    }

    .hero {
      text-align: center;
      padding: 3rem 1rem 1.5rem;
    }

    .hero-content h1 {
      font-size: 1.8rem;
      font-weight: 800;
      margin: 0 0 0.75rem;
      color: #ffffff;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .hero-content p {
      margin: 0 auto;
      max-width: 50ch;
      color: rgba(255, 255, 255, 0.92);
      line-height: 1.6;
      font-size: 1rem;
    }

    .actions-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
      margin: 1.5rem auto 2.5rem;
      padding: 0 1rem;
    }

    .action-btn--primary {
      --background: #0a709c;
      --background-hover: #096389;
      --color: #ffffff;
      --border-radius: 12px;
      --padding-top: 14px;
      --padding-bottom: 14px;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 0.02em;
      min-height: 50px;
    }

    .action-btn--secondary {
      --background: #39b552;
      --background-hover: #329f48;
      --color: #ffffff;
      --border-radius: 12px;
      --padding-top: 14px;
      --padding-bottom: 14px;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 0.02em;
      min-height: 50px;
    }

    .content-grid {
      padding: 0;
    }

    .content-grid ion-col {
      --ion-grid-column-padding: 0;
    }

    ion-card {
      margin: 0 0 1rem;
      border-radius: 14px;
      box-shadow: 0 4px 16px rgba(10, 112, 156, 0.12);
      border: none;
      background: linear-gradient(135deg, #0a709c, #3fa779) !important;
      --background: none;
      --color: #ffffff;
      color: #ffffff;
    }

    ion-card-header {
      --background: transparent;
    }

    ion-card-content {
      --color: #ffffff;
      color: #ffffff;
    }

    ion-card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #ffffff;
    }

    .video-wrapper {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      border-radius: 8px;
    }

    .video-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }

    .news-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .news-item {
      display: flex;
      gap: 0.6rem;
      align-items: flex-start;
      padding: 0.5rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.08);
      text-decoration: none;
      color: inherit;
      transition: background 0.15s;
    }

    .news-item:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .news-img {
      width: 60px;
      height: 45px;
      object-fit: cover;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .news-meta {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .news-meta strong {
      font-size: 0.8rem;
      color: #ffffff;
      line-height: 1.3;
    }

    .news-meta small {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .news-more {
      display: block;
      margin-top: 0.75rem;
      text-align: center;
      color: #e8c843;
      font-size: 0.8rem;
      font-weight: 600;
      text-decoration: none;
    }

    .news-fallback {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.85rem;
      text-align: center;
    }

    .news-fallback a {
      color: #e8c843;
    }

    @media (min-width: 768px) {
      .hero-content h1 {
        font-size: 2.4rem;
      }

      .actions-section {
        flex-direction: row;
        max-width: 500px;
      }

      .actions-section ion-button {
        flex: 1;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V1Dashboard implements OnInit, OnDestroy {
  private readonly newsService = inject(NewsService);

  protected readonly newsItems = this.newsService.news;
  protected readonly newsLoading = this.newsService.loading;

  private timeoutHandle: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    void this.newsService.loadNews();
  }

  ngOnDestroy(): void {
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
  }
}
