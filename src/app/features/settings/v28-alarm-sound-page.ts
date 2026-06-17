import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';

type AlarmSound = { id: string; label: string; file?: string };

@Component({
  selector: 'app-v28-alarm-sound-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="alarm-shell">
      <header class="hero">
        <h1>Sonido de alarma</h1>
        <p class="description">Elige el tono que sonará cuando recibas un recordatorio o una alarma.</p>
      </header>

      <article class="panel">
        <h2>Listado de tonos</h2>
        <div class="list">
          @for (sound of sounds; track sound.id) {
            <label class="sound-row">
              <input type="radio" name="alarm" [value]="sound.id" (change)="selectSound(sound.id)" [checked]="selected() === sound.id" />
              <div class="meta">
                <strong>{{ sound.label }}</strong>
                <button type="button" class="ghost" (click)="previewSound(sound)">Reproducir</button>
              </div>
            </label>
          }
        </div>

        <div class="actions">
          <button type="button" (click)="save()">Guardar sonido</button>
          <a routerLink="/app/settings/v26" class="back-link">Volver</a>
        </div>

        @if (message()) {
          <p class="feedback" role="status">{{ message() }}</p>
        }
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

      .alarm-shell { display: grid; gap: 1rem; padding: 1.25rem; color: #1a1a2e; }

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

      h1, h2, p { margin-top: 0; }

      .panel {
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.85);
        padding: 1rem;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.08);
      }

      .panel h2 { color: #0a709c; margin-bottom: 0.75rem; }

      .list { display: grid; gap: 0.6rem; }

      .sound-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 0.75rem;
        border-radius: 10px;
        background: rgba(10, 112, 156, 0.05);
      }

      .meta { display: flex; gap: 0.5rem; align-items: center; }
      .meta strong { color: #1a1a2e; }

      .ghost {
        background: transparent;
        color: #0a709c;
        border: 1px solid #0a709c;
        border-radius: 8px;
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
        cursor: pointer;
      }

      .actions { display: flex; gap: 0.75rem; margin-top: 1rem; align-items: center; }

      button:not(.ghost) {
        min-height: 44px; border-radius: 10px; border: none;
        padding: 0.6rem 1rem; font: inherit; cursor: pointer;
        background: #e8c843; color: #1a1a2e; font-weight: 600;
      }

      a.back-link {
        color: #0a709c; text-decoration: none; font-weight: 600;
      }

      .feedback { color: #0a709c; font-weight: 500; margin-top: 0.5rem; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V28AlarmSoundPage implements OnInit {
  private readonly storageKey = 'primiparada.settings.alarmSound';
  private readonly storage = inject(StorageService);

  protected readonly sounds: AlarmSound[] = [
    { id: 'beep', label: 'Beep corto' },
    { id: 'chime', label: 'Campana suave' },
    { id: 'alert', label: 'Alerta intensa' }
  ];

  protected readonly selected = signal<string | null>(null);
  protected readonly message = signal('');

  async ngOnInit(): Promise<void> {
    const saved = await this.storage.get(this.storageKey);
    if (saved) this.selected.set(saved);
  }

  protected selectSound(id: string): void {
    this.selected.set(id);
    this.message.set(`Seleccionado: ${id}`);
  }

  protected previewSound(sound: AlarmSound): void {
    // En tests esto sólo actualizará el mensaje; en producción se puede usar Audio API
    this.message.set(`Reproduciendo: ${sound.label}`);
  }

  protected async save(): Promise<void> {
    if (!this.selected()) {
      this.message.set('Selecciona un sonido antes de guardar.');
      return;
    }
    await this.storage.set(this.storageKey, this.selected()!);
    this.message.set(`Sonido ${this.selected()} guardado.`);
  }
}
