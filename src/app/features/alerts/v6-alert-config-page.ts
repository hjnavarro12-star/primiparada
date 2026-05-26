import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-v6-alert-config-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="alertcfg-shell">
      <header class="hero">
        <p class="eyebrow">V6 · Horario</p>
        <h1>Configuración de Alertas</h1>
        <p class="description">Define cuánto antes quieres recibir notificaciones y por qué canal.</p>
      </header>

      <article class="panel">
        <label>
          <span>Minutos antes</span>
          <input type="number" [value]="minutes()" (input)="setMinutes($event)" />
        </label>

        <label>
          <input type="checkbox" [checked]="email()" (change)="toggleEmail($event)" /> Notificaciones por email
        </label>

        <div class="actions">
          <button (click)="save()">Guardar</button>
          <a routerLink="/alerts/v5">Volver</a>
        </div>

        <p class="feedback" role="status" *ngIf="message()">{{ message() }}</p>
      </article>
    </section>
  `,
  styles: [
    `
      .alertcfg-shell { color:#f7fbff }
      .hero, .panel { background: rgba(12,16,31,0.95); padding:1rem; border-radius:12px }
      .actions { margin-top:1rem }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V6AlertConfigPage implements OnInit {
  private readonly storageKey = 'primiparada.settings.alerts';
  private readonly storage = inject(StorageService);

  protected readonly minutes = signal(15);
  protected readonly email = signal(false);
  protected readonly message = signal('');

  async ngOnInit(): Promise<void> {
    try {
      const raw = await this.storage.get(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { minutes?: number; email?: boolean };
      if (typeof parsed.minutes === 'number') this.minutes.set(parsed.minutes);
      if (typeof parsed.email === 'boolean') this.email.set(parsed.email);
    } catch {
      /* ignore */
    }
  }

  protected setMinutes(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.minutes.set(Number(el.value));
  }

  protected toggleEmail(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.email.set(el.checked);
  }

  protected save(): void {
    void this.storage.set(this.storageKey, JSON.stringify({ minutes: this.minutes(), email: this.email() }));
    this.message.set('Configuración de alertas guardada.');
  }
}
