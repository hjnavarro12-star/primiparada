import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-v29-notifications-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="notif-shell">
      <header class="hero">
        <h1>Notificaciones</h1>
        <p class="description">Activa o desactiva las notificaciones y elige canales disponibles.</p>
      </header>

      <article class="panel">
        <label>
          <input type="checkbox" (change)="toggleEnabled($event)" [checked]="enabled()" /> Habilitar notificaciones
        </label>

        <div class="channels" [attr.aria-hidden]="!enabled()">
          <label>
            <input type="checkbox" (change)="toggleEmail($event)" [checked]="email()" /> Notificaciones por email
          </label>
          <label>
            <input type="checkbox" (change)="togglePush($event)" [checked]="push()" /> Notificaciones push
          </label>
        </div>

        <div class="actions">
          <button type="button" (click)="save()">Guardar</button>
          <a routerLink="/app/settings/v26" class="back-link">Volver</a>
        </div>

        <p class="feedback" role="status" *ngIf="message()">{{ message() }}</p>
      </article>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100%;
        background-color: #a0d0c8;
        background-image: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 30%, #a0d0c8 60%);
        background-size: 100% 100vh;
        background-repeat: no-repeat;
      }

      .notif-shell { color: #1a1a2e; display: grid; gap: 1rem; padding: 1.25rem; }

      .hero {
        border-radius: 14px;
        background: linear-gradient(135deg, #0a709c, #3fa779) !important;
        padding: 1.25rem;
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.1);
      }

      .hero .eyebrow { margin: 0 0 0.5rem; text-transform: uppercase; letter-spacing: 0.14em; color: #e8c843; font-size: 0.75rem; }
      .hero h1 { margin: 0 0 0.25rem; font-size: 1.4rem; font-weight: 700; color: #ffffff; }
      .hero .description { margin: 0; color: rgba(255,255,255,0.9); }

      h1, p { margin-top: 0; }

      .panel {
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.85);
        padding: 1rem;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.08);
      }

      .panel label { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; color: #1a1a2e; }
      .channels { display: grid; gap: 0.5rem; margin-top: 0.75rem; padding-left: 1.5rem; }
      .actions { margin-top: 1rem; display: flex; gap: 0.75rem; align-items: center; }

      button {
        min-height: 44px; border-radius: 10px; border: none;
        padding: 0.6rem 1rem; font: inherit; cursor: pointer;
        background: #e8c843; color: #1a1a2e; font-weight: 600;
      }

      a.back-link { color: #0a709c; text-decoration: none; font-weight: 600; }
      .feedback { color: #0a709c; font-weight: 500; margin-top: 0.5rem; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V29NotificationsPage implements OnInit {
  private readonly storageKey = 'primiparada.settings.notifications';
  private readonly storage = inject(StorageService);

  protected readonly enabled = signal(true);
  protected readonly email = signal(false);
  protected readonly push = signal(true);
  protected readonly message = signal('');

  async ngOnInit(): Promise<void> {
    const raw = await this.storage.get(this.storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { enabled?: boolean; email?: boolean; push?: boolean };
      if (typeof parsed.enabled === 'boolean') this.enabled.set(parsed.enabled);
      if (typeof parsed.email === 'boolean') this.email.set(parsed.email);
      if (typeof parsed.push === 'boolean') this.push.set(parsed.push);
    } catch {
      // ignore invalid stored value
    }
  }

  protected toggleEnabled(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.enabled.set(el.checked);
    this.message.set('');
  }

  protected toggleEmail(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.email.set(el.checked);
  }

  protected togglePush(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.push.set(el.checked);
  }

  protected async save(): Promise<void> {
    const payload = { enabled: this.enabled(), email: this.email(), push: this.push() };
    await this.storage.set(this.storageKey, JSON.stringify(payload));
    this.message.set('Preferencias de notificación guardadas.');
  }
}
