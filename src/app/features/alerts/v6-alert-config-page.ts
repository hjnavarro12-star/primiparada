import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRange,
  IonText,
  IonToggle
} from '@ionic/angular/standalone';

import { NotificationSchedulerService } from '../../core/services/notification-scheduler.service';
import { StorageService } from '../../core/services/storage.service';
import { SupabaseClientService } from '../../core/services/supabase-client.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-v6-alert-config-page',
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
    IonList,
    IonNote,
    IonRange,
    IonText,
    IonToggle
  ],
  template: `
    <div class="config-content">
      <div class="page-header">
        <h2>Configuración de Alertas</h2>
        <p>Define cuánto antes quieres recibir notificaciones.</p>
      </div>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Tiempo de anticipación</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p class="range-value">{{ minutes() }} minutos antes</p>
          <ion-range
            [min]="5"
            [max]="60"
            [step]="5"
            [value]="minutes()"
            (ionChange)="onMinutesChange($event)"
            color="secondary"
          >
            <ion-note slot="start">5</ion-note>
            <ion-note slot="end">60</ion-note>
          </ion-range>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Canales de notificación</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none" class="toggle-list">
            <ion-item>
              <ion-label>Vibración</ion-label>
              <ion-toggle
                [checked]="vibration()"
                (ionChange)="toggleVibration($event)"
                color="secondary"
              ></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-label>Sonido</ion-label>
              <ion-toggle
                [checked]="sound()"
                (ionChange)="toggleSound($event)"
                color="secondary"
              ></ion-toggle>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      @if (message()) {
        <ion-text color="success">
          <p class="feedback">{{ message() }}</p>
        </ion-text>
      }

      <div class="actions">
        <ion-button expand="block" (click)="save()">
          Guardar configuración
        </ion-button>
        <ion-button expand="block" fill="outline" routerLink="/app/alerts/v5">
          Volver a Alertas
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

    .config-content {
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

    .range-value {
      text-align: center;
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: #ffffff;
    }

    ion-range {
      --bar-background: rgba(255, 255, 255, 0.3);
      --bar-background-active: #e8c843;
      --knob-background: #e8c843;
    }

    ion-note {
      color: rgba(255, 255, 255, 0.7);
    }

    .toggle-list {
      --ion-item-background: transparent;
    }

    .toggle-list ion-item {
      --background: rgba(255, 255, 255, 0.1);
      --color: #ffffff;
      border-radius: 8px;
      margin-bottom: 4px;
    }

    .toggle-list ion-label {
      color: #ffffff;
    }

    .feedback {
      text-align: center;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 10px;
      color: #0a709c;
      font-weight: 600;
      margin: 0 0 1rem;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
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
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V6AlertConfigPage implements OnInit {
  private readonly storageKey = 'primiparada.settings.alerts';
  private readonly storage = inject(StorageService);
  private readonly supabaseClient = inject(SupabaseClientService);
  private readonly authService = inject(AuthService);
  private readonly notificationScheduler = inject(NotificationSchedulerService);

  protected readonly minutes = signal(15);
  protected readonly vibration = signal(true);
  protected readonly sound = signal(true);
  protected readonly message = signal('');

  async ngOnInit(): Promise<void> {
    // Intentar cargar de Supabase primero (datos del usuario actual)
    const user = this.authService.userSnapshot;
    if (user) {
      try {
        const { data } = await this.supabaseClient.client
          .from('notifications_config')
          .select('minutes_before, vibration, sound')
          .eq('user_id', user.id)
          .single();

        if (data) {
          this.minutes.set(data.minutes_before ?? 15);
          this.vibration.set(data.vibration ?? true);
          this.sound.set(data.sound ?? true);
          return;
        }
      } catch { /* fallback a local */ }
    }

    // Fallback: cargar de storage local
    try {
      const raw = await this.storage.get(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { minutes?: number; vibration?: boolean; sound?: boolean };
      if (typeof parsed.minutes === 'number') this.minutes.set(parsed.minutes);
      if (typeof parsed.vibration === 'boolean') this.vibration.set(parsed.vibration);
      if (typeof parsed.sound === 'boolean') this.sound.set(parsed.sound);

      // Subir datos locales a Supabase para que queden como default del usuario
      if (user) {
        try {
          await this.supabaseClient.client
            .from('notifications_config')
            .upsert({
              user_id: user.id,
              minutes_before: this.minutes(),
              vibration: this.vibration(),
              sound: this.sound(),
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
        } catch { /* si falla, no bloquear */ }
      }
    } catch { /* ignore */ }
  }

  protected onMinutesChange(event: CustomEvent): void {
    this.minutes.set(event.detail.value as number);
  }

  protected toggleVibration(event: CustomEvent): void {
    this.vibration.set(event.detail.checked as boolean);
  }

  protected toggleSound(event: CustomEvent): void {
    this.sound.set(event.detail.checked as boolean);
  }

  protected async save(): Promise<void> {
    const config = {
      minutes: this.minutes(),
      vibration: this.vibration(),
      sound: this.sound()
    };

    // Guardar local siempre
    void this.storage.set(this.storageKey, JSON.stringify(config));

    // Guardar en Supabase si hay usuario autenticado
    const user = this.authService.userSnapshot;
    if (user) {
      try {
        await this.supabaseClient.client
          .from('notifications_config')
          .upsert({
            user_id: user.id,
            minutes_before: config.minutes,
            vibration: config.vibration,
            sound: config.sound,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
      } catch { /* si falla remoto, al menos quedó local */ }
    }

    // Reprogramar notificaciones con la nueva configuración
    await this.notificationScheduler.scheduleAll();

    this.message.set('✓ Configuración guardada');
    setTimeout(() => this.message.set(''), 3000);
  }
}
