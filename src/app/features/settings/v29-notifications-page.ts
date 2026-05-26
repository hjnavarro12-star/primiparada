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
        <p class="eyebrow">V29 · Configuración</p>
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
          <a routerLink="/settings/v26" class="back-link">Volver</a>
        </div>

        <p class="feedback" role="status" *ngIf="message()">{{ message() }}</p>
      </article>
    </section>
  `,
  styles: [
    `
      .notif-shell { color:#f7fbff; display:grid; gap:1rem }
      .hero, .panel { background: rgba(12,16,31,0.95); padding:1rem; border-radius:12px }
      .channels { display:grid; gap:0.5rem; margin-top:0.5rem }
      .actions { margin-top:1rem; display:flex; gap:0.5rem }
      .feedback { color:#8bd3ff }
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
