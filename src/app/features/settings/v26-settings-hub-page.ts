import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type SettingsShortcut = {
  code: 'V27' | 'V28' | 'V29' | 'V30' | 'V31';
  title: string;
  description: string;
  path: string;
  accent: string;
};

@Component({
  selector: 'app-v26-settings-hub-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="settings-shell">
      <header class="hero">
        <p class="eyebrow">V26 · Configuración</p>
        <h1>Configuraciones generales</h1>
        <p class="description">
          Ajusta la experiencia de la app, entra a cada subsección y revisa un resumen de las preferencias más usadas.
        </p>

        <div class="status-grid" aria-label="Resumen de configuraciones">
          <article class="status-card">
            <span class="label">Vista activa</span>
            <strong>General</strong>
          </article>
          <article class="status-card">
            <span class="label">Tamaño actual</span>
            <strong>{{ fontSize() }} px</strong>
          </article>
          <article class="status-card">
            <span class="label">Tema</span>
            <strong>{{ currentThemeLabel() }}</strong>
          </article>
        </div>
      </header>

      <div class="content-grid">
        <article class="panel accent-panel">
          <h2>Accesos rápidos</h2>
          <div class="shortcut-list">
            @for (shortcut of shortcuts; track shortcut.code) {
              <a class="shortcut-card" [routerLink]="shortcut.path" [style.--accent]="shortcut.accent">
                <span class="shortcut-code">{{ shortcut.code }}</span>
                <strong>{{ shortcut.title }}</strong>
                <p>{{ shortcut.description }}</p>
              </a>
            }
          </div>
        </article>

        <article class="panel preview-panel">
          <h2>Vista previa</h2>
          <p class="preview-copy">
            Esta pantalla actúa como centro de mando para los ajustes. Los siguientes botones representan el recorrido principal.
          </p>

          <div class="preview-actions" role="group" aria-label="Controles de vista previa">
            <button type="button" class="ghost" (click)="decreaseFont()" [disabled]="fontSize() <= 12">A-</button>
            <button type="button" class="ghost" (click)="increaseFont()" [disabled]="fontSize() >= 20">A+</button>
            <button type="button" [class.active]="theme() === 'blue'" (click)="setTheme('blue')">Azul</button>
            <button type="button" [class.active]="theme() === 'green'" (click)="setTheme('green')">Verde</button>
          </div>

          <div class="preview-box" [style.fontSize.px]="fontSize()">
            <h3>Tarjeta de ejemplo</h3>
            <p>Tu experiencia se puede adaptar con un tamaño legible y un tema visual consistente.</p>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .settings-shell {
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

      .description,
      .preview-copy {
        color: #b8d9f0;
      }

      .status-grid {
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        margin-top: 1rem;
      }

      .status-card {
        border-radius: 16px;
        border: 1px solid rgba(139, 211, 255, 0.18);
        background: rgba(255, 255, 255, 0.04);
        padding: 0.9rem;
      }

      .label {
        display: block;
        margin-bottom: 0.3rem;
        color: #8bd3ff;
        font-size: 0.76rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .content-grid {
        display: grid;
        gap: 1rem;
      }

      .panel {
        padding: 1rem;
      }

      .shortcut-list {
        display: grid;
        gap: 0.75rem;
      }

      .shortcut-card {
        --accent: #5fb2ff;
        display: grid;
        gap: 0.35rem;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
        padding: 0.95rem;
        color: inherit;
        text-decoration: none;
        border-left: 4px solid var(--accent);
      }

      .shortcut-code {
        color: var(--accent);
        font-size: 0.76rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .shortcut-card p {
        margin-bottom: 0;
        color: #b8d9f0;
      }

      .preview-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin: 1rem 0;
      }

      button {
        min-height: 48px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 0.75rem 0.9rem;
        font: inherit;
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

      button.active {
        box-shadow: 0 0 0 2px rgba(139, 211, 255, 0.35) inset;
      }

      button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .preview-box {
        border-radius: 18px;
        border: 1px solid rgba(139, 211, 255, 0.18);
        background: rgba(139, 211, 255, 0.08);
        padding: 1rem;
      }

      @media (min-width: 992px) {
        .content-grid {
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          align-items: start;
        }
      }

      @media (max-width: 640px) {
        .status-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V26SettingsHubPage {
  protected readonly shortcuts: SettingsShortcut[] = [
    {
      code: 'V27',
      title: 'Tamaño de fuente',
      description: 'Ajusta el tamaño global para lectura cómoda.',
      path: '/settings/v27',
      accent: '#5fb2ff'
    },
    {
      code: 'V28',
      title: 'Sonido de alarma',
      description: 'Elige el tono que escuchas en los avisos.',
      path: '/settings/v28',
      accent: '#4ecdc4'
    },
    {
      code: 'V29',
      title: 'Notificaciones',
      description: 'Activa o desactiva alertas del sistema.',
      path: '/settings/v29',
      accent: '#8bd3ff'
    },
    {
      code: 'V30',
      title: 'Color de la app',
      description: 'Cambia la identidad visual principal.',
      path: '/settings/v30',
      accent: '#ff9f1c'
    },
    {
      code: 'V31',
      title: 'Licencias y acerca de',
      description: 'Consulta información técnica y legal.',
      path: '/settings/v31',
      accent: '#c38dff'
    }
  ];

  protected readonly fontSize = signal(16);
  protected readonly theme = signal<'blue' | 'green'>('blue');

  protected readonly currentThemeLabel = computed(() => (this.theme() === 'blue' ? 'Azul institucional' : 'Verde natural'));

  protected increaseFont(): void {
    this.fontSize.update((value) => Math.min(20, value + 1));
  }

  protected decreaseFont(): void {
    this.fontSize.update((value) => Math.max(12, value - 1));
  }

  protected setTheme(nextTheme: 'blue' | 'green'): void {
    this.theme.set(nextTheme);
  }
}