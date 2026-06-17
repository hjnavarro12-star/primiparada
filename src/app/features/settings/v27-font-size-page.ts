import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-v27-font-size-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="font-shell">
      <header class="hero">
        <h1>Tamaño de letra</h1>
        <p class="description">
          Ajusta la escala tipográfica global para que toda la aplicación se lea con mayor comodidad.
        </p>

        <div class="current-size" aria-live="polite">
          <span>Tamaño actual</span>
          <strong>{{ fontSize() }} px</strong>
        </div>
      </header>

      <article class="panel">
        <h2>Control principal</h2>

        <label class="range-field">
          <span>Desliza para cambiar el tamaño</span>
          <input
            type="range"
            min="12"
            max="20"
            step="1"
            [value]="fontSize()"
            (input)="onSliderChange($event)"
            aria-label="Tamaño de letra"
          />
        </label>

        <div class="quick-actions" role="group" aria-label="Ajustes rápidos de tamaño">
          <button type="button" class="ghost" (click)="setSize(12)">Compacto</button>
          <button type="button" class="ghost" (click)="setSize(16)">Normal</button>
          <button type="button" class="ghost" (click)="setSize(20)">Amplio</button>
        </div>

        <div class="preview" [style.fontSize.px]="fontSize()">
          <h3>Vista de ejemplo</h3>
          <p>
            El contenido se adapta al tamaño elegido. Esta previsualización replica el impacto visual sobre texto, botones y
            resúmenes de uso común.
          </p>
        </div>
      </article>

      <div class="footer-actions">
        <button type="button" (click)="resetSize()">Restablecer</button>
        <a routerLink="/app/settings/v26" class="back-link">Volver a configuración general</a>
      </div>

      @if (message()) {
        <p class="feedback" role="status">{{ message() }}</p>
      }
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

      .font-shell { display: grid; gap: 1rem; padding: 1.25rem; color: #1a1a2e; }

      .hero {
        border-radius: 14px;
        background: linear-gradient(135deg, #0a709c, #3fa779) !important;
        padding: 1.25rem;
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.1);
      }

      .hero .eyebrow { margin: 0 0 0.5rem; text-transform: uppercase; letter-spacing: 0.14em; color: #e8c843; font-size: 0.75rem; }
      .hero h1 { margin: 0 0 0.25rem; font-size: 1.4rem; font-weight: 700; color: #ffffff; }
      .hero .description { margin-bottom: 0; color: rgba(255,255,255,0.9); }

      .current-size {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.1);
        padding: 0.75rem 1rem;
      }

      .current-size span { color: #e8c843; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.7rem; }
      .current-size strong { color: #ffffff; }

      h1, h2, h3, p { margin-top: 0; }

      .panel {
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.85);
        padding: 1rem;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.08);
      }

      .panel h2 { color: #0a709c; margin-bottom: 0.75rem; }

      .range-field { display: grid; gap: 0.5rem; }
      .range-field span { color: #0a709c; font-weight: 600; font-size: 0.85rem; }
      input[type='range'] { width: 100%; accent-color: #0a709c; }

      .quick-actions, .footer-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem; }

      button {
        min-height: 44px; border-radius: 10px; border: none;
        padding: 0.6rem 0.9rem; font: inherit; cursor: pointer;
        background: #e8c843; color: #1a1a2e; font-weight: 600;
      }

      .ghost { background: transparent; color: #0a709c; border: 2px solid #0a709c; }

      .preview {
        margin-top: 1rem;
        border-radius: 12px;
        background: linear-gradient(135deg, #0a709c, #3fa779);
        padding: 1rem;
        color: #ffffff;
      }

      .preview h3 { color: #e8c843; }
      .preview p { color: rgba(255,255,255,0.9); }

      .back-link {
        display: inline-flex; align-items: center; justify-content: center;
        min-height: 44px; border-radius: 10px; border: 2px solid #0a709c;
        padding: 0.6rem 0.9rem; color: #0a709c; text-decoration: none;
        font-weight: 600; background: transparent;
      }

      .feedback { margin: 0; color: #0a709c; font-weight: 500; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V27FontSizePage implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(StorageService);
  private readonly storageKey = 'primiparada.settings.fontSize';

  protected readonly fontSize = signal(16);
  protected readonly message = signal('');
  protected readonly fontLabel = computed(() => `${this.fontSize()} px`);

  async ngOnInit(): Promise<void> {
    const storedValue = await this.storage.get(this.storageKey);
    const savedSize = storedValue === null ? 16 : Number(storedValue);

    this.applySize(Number.isFinite(savedSize) ? savedSize : 16, false);
    this.message.set('Mueve el control o usa los accesos rápidos para adaptar la tipografía.');
  }

  protected onSliderChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.applySize(Number(input.value));
  }

  protected setSize(size: number): void {
    this.applySize(size);
  }

  protected resetSize(): void {
    this.applySize(16);
    this.message.set('Tamaño restablecido al valor base.');
  }

  private applySize(size: number, persist = true): void {
    const normalizedSize = Math.min(20, Math.max(12, Math.round(size)));

    this.fontSize.set(normalizedSize);
    this.document.documentElement.style.setProperty('--app-font-size', `${normalizedSize}px`);
    if (persist) {
      void this.storage.set(this.storageKey, String(normalizedSize));
    }
    this.message.set(`Tipografía ajustada a ${normalizedSize}px.`);
  }
}