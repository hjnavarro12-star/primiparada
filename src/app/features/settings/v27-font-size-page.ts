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
        <p class="eyebrow">V27 · Configuración</p>
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
        <a routerLink="/settings/v26" class="back-link">Volver a configuración general</a>
      </div>

      @if (message()) {
        <p class="feedback" role="status">{{ message() }}</p>
      }
    </section>
  `,
  styles: [
    `
      .font-shell {
        display: grid;
        gap: 1rem;
        color: #f7fbff;
      }

      .hero,
      .panel {
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: linear-gradient(180deg, rgba(12, 16, 31, 0.95), rgba(8, 12, 22, 0.98));
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
      }

      .hero {
        padding: 1.25rem;
      }

      .eyebrow {
        margin: 0 0 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: #8bd3ff;
        font-size: 0.75rem;
      }

      h1,
      h2,
      h3,
      p {
        margin-top: 0;
      }

      .description {
        margin-bottom: 0;
        color: #b8d9f0;
      }

      .current-size {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
        margin-top: 1rem;
        border-radius: 16px;
        border: 1px solid rgba(139, 211, 255, 0.18);
        background: rgba(255, 255, 255, 0.04);
        padding: 0.9rem 1rem;
      }

      .current-size span {
        color: #8bd3ff;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.76rem;
      }

      .panel {
        padding: 1rem;
      }

      .range-field {
        display: grid;
        gap: 0.75rem;
      }

      .range-field span {
        color: #8bd3ff;
        font-weight: 600;
      }

      input[type='range'] {
        width: 100%;
        accent-color: #8bd3ff;
      }

      .quick-actions,
      .footer-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      button,
      .back-link {
        min-height: 48px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 0.75rem 0.9rem;
        font: inherit;
      }

      button {
        cursor: pointer;
        background: linear-gradient(135deg, #8bd3ff, #4ecdc4);
        color: #08111e;
        font-weight: 700;
      }

      .ghost {
        background: rgba(255, 255, 255, 0.05);
        color: inherit;
        border-color: rgba(139, 211, 255, 0.5);
      }

      .preview {
        margin-top: 1rem;
        border-radius: 18px;
        border: 1px solid rgba(139, 211, 255, 0.18);
        background: rgba(139, 211, 255, 0.08);
        padding: 1rem;
      }

      .preview p {
        color: #dceffc;
      }

      .back-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #8bd3ff;
        text-decoration: none;
        background: rgba(255, 255, 255, 0.04);
      }

      .feedback {
        margin: 0;
        color: #8bd3ff;
      }

      @media (min-width: 992px) {
        .font-shell {
          grid-template-columns: minmax(0, 1.5fr) minmax(0, 0.7fr);
          align-items: start;
        }

        .hero,
        .panel,
        .footer-actions,
        .feedback {
          grid-column: 1 / -1;
        }
      }
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