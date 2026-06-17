import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

import { ScheduleService } from '../../core/services/schedule.service';
import { NewsService } from '../../core/services/news.service';
import { dayLabel } from '../../shared/utils/day-label.util';
import type { Schedule } from '../../shared/models/schedule.model';

@Component({
  selector: 'app-v4-dashboard',
  standalone: true,
  imports: [
    RouterLink,
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
    <div class="dashboard-content">
      <div class="welcome-header">
        <h2>Mi Dashboard</h2>
        <p>Acceso rápido a tu horario, alertas y campus.</p>
      </div>

      <ion-grid>
        <!-- Próxima clase — highlighted card -->
        <ion-row>
          <ion-col size="12">
            <ion-card class="next-class-card">
              <ion-card-header>
                <ion-card-title>Próxima clase</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                @if (nextClass()) {
                  <div class="class-info">
                    <p class="subject">{{ nextClass()!.subject }}</p>
                    <p>{{ dayLabel(nextClass()!.day_of_week) }} · {{ nextClass()!.start_time }} - {{ nextClass()!.end_time }}</p>
                    <p>{{ nextClass()!.room_label || 'Salón por definir' }}</p>
                  </div>
                } @else {
                  <p>Sin clases próximas registradas.</p>
                }
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <!-- Horario + Noticias side by side on desktop -->
        <ion-row>
          <ion-col size="12" size-lg="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Horario</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                @if (nextClass()) {
                  <p>Resumen rápido activo. El detalle completo está en el Gestor de Horario.</p>
                  <ion-button fill="outline" expand="block" routerLink="/app/schedule/v24">
                    Abrir gestor de horario
                  </ion-button>
                } @else {
                  <p>Sin horario aún.</p>
                  <ion-button fill="outline" expand="block" routerLink="/app/schedule/v21">
                    Crear mi horario
                  </ion-button>
                }
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-lg="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Noticias</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                @if (newsLoading()) {
                  <ion-skeleton-text [animated]="true" style="height: 24px; width: 80%"></ion-skeleton-text>
                  <ion-skeleton-text [animated]="true" style="height: 24px; width: 60%"></ion-skeleton-text>
                  <ion-skeleton-text [animated]="true" style="height: 24px; width: 70%"></ion-skeleton-text>
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
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
      background: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 40%, #a0d0c8 100%);
    }

    .dashboard-content {
      padding: 1.25rem;
    }

    .welcome-header {
      margin-bottom: 1.25rem;
    }

    .welcome-header h2 {
      margin: 0 0 0.25rem;
      font-size: 1.4rem;
      font-weight: 700;
      color: #0a709c;
    }

    .welcome-header p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    ion-card {
      margin: 0;
      border-radius: 14px;
      box-shadow: 0 4px 16px rgba(10, 112, 156, 0.1);
      border: none;
      background: linear-gradient(135deg, #0a709c, #3fa779) !important;
      --background: none;
      --color: #ffffff;
      color: #ffffff;
    }

    ion-card-header {
      --background: transparent;
    }

    ion-card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #ffffff;
    }

    ion-card-content {
      --color: #ffffff;
      color: #ffffff;
    }

    ion-card p {
      color: rgba(255, 255, 255, 0.92);
    }

    .next-class-card {
      background: linear-gradient(135deg, #0a709c, #3fa779) !important;
      --background: none;
      --color: #ffffff;
      border: none;
      color: #ffffff;
    }

    .next-class-card ion-card-header {
      --background: transparent;
    }

    .next-class-card ion-card-title {
      color: #ffffff;
    }

    .next-class-card ion-card-content {
      --color: #ffffff;
      color: #ffffff;
    }

    .next-class-card p {
      color: #ffffff;
    }

    .class-info p {
      margin: 0 0 4px;
    }

    .class-info .subject {
      font-weight: 700;
      font-size: 1.15rem;
      color: #ffffff;
    }

    .news-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .news-item {
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
      padding: 0.4rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.08);
      text-decoration: none;
      color: inherit;
    }

    .news-img {
      width: 50px;
      height: 38px;
      object-fit: cover;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .news-meta strong {
      font-size: 0.8rem;
      color: #ffffff;
      line-height: 1.3;
      display: block;
    }

    .news-meta small {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .news-more {
      display: block;
      margin-top: 0.5rem;
      text-align: center;
      color: #e8c843;
      font-size: 0.8rem;
      font-weight: 600;
      text-decoration: none;
    }

    .news-fallback {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.85rem;
    }

    .news-fallback a {
      color: #e8c843;
    }

    ion-button {
      margin-top: 0.75rem;
      --background: #ffffff;
      --color: #0a709c;
      --border-radius: 10px;
      font-weight: 600;
    }

    ion-button[fill="outline"] {
      --background: transparent;
      --color: #ffffff;
      --border-color: #ffffff;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V4Dashboard implements OnInit, OnDestroy {
  private readonly scheduleService = inject(ScheduleService);
  private readonly newsService = inject(NewsService);
  private scheduleSub: Subscription | null = null;

  protected readonly nextClass = signal<Schedule | null>(null);
  protected readonly newsItems = this.newsService.news;
  protected readonly newsLoading = this.newsService.loading;

  ngOnInit(): void {
    this.scheduleSub = this.scheduleService.nextClass$.subscribe((item) => {
      this.nextClass.set(item);
    });

    void this.newsService.loadNews();
  }

  ngOnDestroy(): void {
    this.scheduleSub?.unsubscribe();
  }

  protected dayLabel(day: number): string {
    return dayLabel(day);
  }
}
