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
        <p class="eyebrow">V28 · Configuración</p>
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
          <a routerLink="/settings/v26" class="back-link">Volver</a>
        </div>

        @if (message()) {
          <p class="feedback" role="status">{{ message() }}</p>
        }
      </article>
    </section>
  `,
  styles: [
    `
      .alarm-shell { display: grid; gap: 1rem; color: #f7fbff; }
      .hero, .panel { border-radius: 16px; padding: 1rem; background: rgba(12,16,31,0.95); }
      .list { display: grid; gap: 0.6rem; }
      .sound-row { display:flex; align-items:center; gap:0.75rem; }
      .meta { display:flex; gap:0.5rem; align-items:center; }
      .ghost { background: rgba(255,255,255,0.04); border-radius:8px; padding:0.4rem; }
      .actions { display:flex; gap:0.75rem; margin-top:1rem; }
      .feedback { color:#8bd3ff; }
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
