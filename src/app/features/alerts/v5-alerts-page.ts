import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/angular/standalone';

import { ScheduleService } from '../../core/services/schedule.service';

@Component({
  selector: 'app-v5-alerts-page',
  standalone: true,
  imports: [
    RouterLink,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonList
  ],
  template: `
    <div class="alerts-content">
      <div class="page-header">
        <h2>Alertas</h2>
        <p>Próximas clases y eventos programados.</p>
      </div>

      <!-- Próxima clase -->
      <ion-card class="highlight-card">
        <ion-card-header>
          <ion-card-title>Próxima clase</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          @if (next(); as nextItem) {
            <p class="subject">{{ nextItem.subject }}</p>
            <p>{{ nextItem.teacher }} — {{ nextItem.start_time }} a {{ nextItem.end_time }}</p>
            <p>{{ nextItem.room_label || 'Salón por definir' }}</p>
          } @else {
            <p>No hay clases programadas.</p>
          }
        </ion-card-content>
      </ion-card>

      <!-- Todas las clases -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Todas las clases del día</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          @if (schedules().length > 0) {
            <ion-list lines="full" class="class-list">
              @for (item of schedules(); track item.id) {
                <ion-item>
                  <ion-label>
                    <h3>{{ item.subject }}</h3>
                    <p>{{ item.start_time }} — Día {{ item.day_of_week }}</p>
                  </ion-label>
                </ion-item>
              }
            </ion-list>
          } @else {
            <p>No tienes clases registradas.</p>
          }
        </ion-card-content>
      </ion-card>

      <!-- Acciones -->
      <div class="actions">
        <ion-button expand="block" routerLink="/app/alerts/v6">
          Configurar alertas
        </ion-button>
        <ion-button expand="block" fill="outline" routerLink="/app/schedule/v24">
          Ir al Gestor de Horario
        </ion-button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
      background: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 40%, #a0d0c8 100%);
    }

    .alerts-content {
      padding: 1.25rem;
    }

    .page-header {
      margin-bottom: 1.25rem;
    }

    .page-header h2 {
      margin: 0 0 0.25rem;
      font-size: 1.4rem;
      font-weight: 700;
      color: #0a709c;
    }

    .page-header p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    ion-card {
      margin: 0 0 1rem;
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
      margin: 0 0 4px;
    }

    .subject {
      font-weight: 700;
      font-size: 1.1rem;
      color: #ffffff !important;
    }

    .class-list {
      --ion-item-background: transparent;
      --ion-item-color: #ffffff;
    }

    .class-list ion-item {
      --background: rgba(255, 255, 255, 0.1);
      --color: #ffffff;
      --border-color: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      margin-bottom: 4px;
    }

    .class-list ion-label h3 {
      color: #ffffff;
      font-weight: 600;
    }

    .class-list ion-label p {
      color: rgba(255, 255, 255, 0.8);
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .actions ion-button {
      --background: #e8c843;
      --color: #1a1a2e;
      --border-radius: 12px;
      font-weight: 600;
      min-height: 48px;
    }

    .actions ion-button[fill="outline"] {
      --background: #39b552;
      --color: #ffffff;
      --border-color: #39b552;
      --border-width: 0;
      --border-radius: 12px;
      font-weight: 600;
      min-height: 48px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V5AlertsPage {
  private readonly scheduleService = inject(ScheduleService);

  protected readonly schedules = toSignal(this.scheduleService.schedules$, { initialValue: [] });
  protected readonly next = toSignal(this.scheduleService.nextClass$, { initialValue: null });
  protected readonly hasSchedules = computed(() => this.schedules().length > 0);
}
