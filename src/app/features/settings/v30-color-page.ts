import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-v30-color-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="color-shell">
      <header class="hero">
        <p class="eyebrow">V30 · Configuración</p>
        <h1>Color de la App</h1>
        <p class="description">Elige el color principal de la aplicación para personalizar el tema.</p>
      </header>

      <article class="panel">
        <div class="swatches">
          <button type="button" *ngFor="let c of colors" [style.background]="c" (click)="selectColor(c)" [attr.aria-pressed]="selected() === c"></button>
        </div>

        <div class="actions">
          <button type="button" (click)="save()">Guardar color</button>
          <a routerLink="/settings/v26" class="back-link">Volver</a>
        </div>

        <p class="feedback" role="status" *ngIf="message()">{{ message() }}</p>
      </article>
    </section>
  `,
  styles: [
    `
      .color-shell { color:#f7fbff; display:grid; gap:1rem }
      .hero, .panel { background: rgba(12,16,31,0.95); padding:1rem; border-radius:12px }
      .swatches { display:flex; gap:0.5rem }
      .swatches button { width:40px; height:40px; border-radius:8px; border:2px solid rgba(255,255,255,0.06) }
      .actions { margin-top:1rem }
      .feedback { color:#8bd3ff }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V30ColorPage implements OnInit {
  private readonly storageKey = 'primiparada.settings.color';
  private readonly storage = inject(StorageService);

  protected readonly colors = ['#4ecdc4', '#5fb2ff', '#ff9f1c', '#8bd3ff', '#4f9f6b'];
  protected readonly selected = signal<string | null>(null);
  protected readonly message = signal('');

  async ngOnInit(): Promise<void> {
    const stored = await this.storage.get(this.storageKey);
    if (stored) {
      this.selected.set(stored);
      document.documentElement.style.setProperty('--app-accent', stored);
    }
  }

  protected selectColor(color: string): void {
    this.selected.set(color);
    this.message.set(`Seleccionado: ${color}`);
    document.documentElement.style.setProperty('--app-accent', color);
  }

  protected async save(): Promise<void> {
    if (!this.selected()) {
      this.message.set('Selecciona un color antes de guardar.');
      return;
    }
    await this.storage.set(this.storageKey, this.selected()!);
    this.message.set(`Color guardado: ${this.selected()}`);
  }
}
