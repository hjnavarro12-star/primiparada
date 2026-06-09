import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline } from 'ionicons/icons';

import { ScheduleService } from '../../core/services/schedule.service';

@Component({
  selector: 'app-v5-alerts-page',
  standalone: true,
  imports: [
    RouterLink,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/access/v4"></ion-back-button>
          <ion-menu-button aria-label="Abrir menú principal"></ion-menu-button>
        </ion-buttons>
        <ion-title>Alertas</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/alerts/v6" aria-label="Configurar alertas">
            <ion-icon slot="icon-only" name="settings-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Próxima clase -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Próxima clase</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          @if (next(); as nextItem) {
            <p><strong>{{ nextItem.subject }}</strong></p>
            <p>{{ nextItem.teacher }} — {{ nextItem.start_time }} a {{ nextItem.end_time }}</p>
            <p>{{ nextItem.room_label }}</p>
          } @else {
            <p>No hay clases programadas.</p>
          }
        </ion-card-content>
      </ion-card>

      <!-- Todas las clases -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Todas las clases</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          @if (schedules().length > 0) {
            <ion-list lines="full">
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
      <ion-button expand="block" fill="outline" routerLink="/schedule/v24" class="ion-margin-top">
        Ir al Gestor de Horario
      </ion-button>
    </ion-content>
  `,
  styles: [`
    ion-card {
      margin-bottom: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V5AlertsPage {
  private readonly scheduleService = inject(ScheduleService);

  protected readonly schedules = toSignal(this.scheduleService.schedules$, { initialValue: [] });
  protected readonly next = toSignal(this.scheduleService.nextClass$, { initialValue: null });
  protected readonly hasSchedules = computed(() => this.schedules().length > 0);

  constructor() {
    addIcons({ settingsOutline });
  }
}
