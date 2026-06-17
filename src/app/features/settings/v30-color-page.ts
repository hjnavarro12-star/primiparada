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
        <h1>Color de la App</h1>
        <p class="description">Elige el color principal de la aplicación para personalizar el tema.</p>
      </header>

      <article class="panel">
        <div class="swatches">
          <button type="button" *ngFor="let c of colors" [style.background]="c" (click)="selectColor(c)" [attr.aria-pressed]="selected() === c"></button>
        </div>

        <div class="actions">
          <button type="button" (click)="save()">Guardar color</button>
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

      .color-shell { color: #1a1a2e; display: grid; gap: 1rem; padding: 1.25rem; }

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

      .swatches { display: flex; gap: 0.75rem; flex-wrap: wrap; }

      .swatches button {
        width: 48px; height: 48px; border-radius: 12px;
        border: 3px solid rgba(10, 112, 156, 0.1);
        cursor: pointer; transition: transform 0.15s;
        min-height: auto; padding: 0;
      }

      .swatches button:hover { transform: scale(1.1); }
      .swatches button[aria-pressed="true"] { border-color: #0a709c; box-shadow: 0 0 0 3px rgba(10,112,156,0.3); }

      .actions { margin-top: 1rem; display: flex; gap: 0.75rem; align-items: center; }

      button:not(.swatches button) {
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
