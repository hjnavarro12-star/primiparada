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
      :host {
        display: block;
        min-height: 100%;
        background-color: #a0d0c8;
        background-image: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 30%, #a0d0c8 60%);
        background-size: 100% 100vh;
        background-repeat: no-repeat;
      }

      .settings-shell {
        display: grid;
        gap: 1rem;
        padding: 1.25rem;
        color: #1a1a2e;
      }

      .hero {
        border-radius: 14px;
        background: linear-gradient(135deg, #0a709c, #3fa779) !important;
        padding: 1.25rem;
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.1);
      }

      .hero .eyebrow {
        margin: 0 0 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: #e8c843;
        font-size: 0.75rem;
      }

      .hero h1 { margin: 0 0 0.25rem; font-size: 1.4rem; font-weight: 700; color: #ffffff; }
      .hero .description { color: rgba(255,255,255,0.9); margin: 0; }

      .status-grid {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        margin-top: 1rem;
      }

      .status-card {
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.1);
        padding: 0.75rem;
      }

      .label {
        display: block;
        margin-bottom: 0.25rem;
        color: #e8c843;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .status-card strong { color: #ffffff; }

      h1, h2, h3, p { margin-top: 0; }

      .content-grid { display: grid; gap: 1rem; }

      .panel {
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.85);
        padding: 1rem;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.08);
      }

      .panel h2 { color: #0a709c; font-size: 1.1rem; margin-bottom: 0.75rem; }

      .shortcut-list { display: grid; gap: 0.6rem; }

      .shortcut-card {
        --accent: #0a709c;
        display: grid;
        gap: 0.25rem;
        border-radius: 12px;
        background: linear-gradient(135deg, #0a709c, #3fa779);
        padding: 0.85rem;
        color: #ffffff;
        text-decoration: none;
        border-left: 4px solid var(--accent);
      }

      .shortcut-code {
        color: #e8c843;
        font-size: 0.7rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .shortcut-card strong { color: #ffffff; }
      .shortcut-card p { margin-bottom: 0; color: rgba(255,255,255,0.85); font-size: 0.85rem; }

      .preview-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.75rem 0;
      }

      button {
        min-height: 44px;
        border-radius: 10px;
        border: none;
        padding: 0.6rem 0.9rem;
        font: inherit;
        cursor: pointer;
        background: #e8c843;
        color: #1a1a2e;
        font-weight: 600;
      }

      .ghost {
        background: transparent;
        color: #0a709c;
        border: 2px solid #0a709c;
      }

      button.active {
        box-shadow: 0 0 0 2px rgba(10, 112, 156, 0.3) inset;
      }

      button:disabled { opacity: 0.5; cursor: not-allowed; }

      .preview-box {
        border-radius: 12px;
        background: linear-gradient(135deg, #0a709c, #3fa779);
        padding: 1rem;
        color: #ffffff;
      }

      .preview-box h3 { color: #e8c843; margin-bottom: 0.5rem; }
      .preview-box p { color: rgba(255,255,255,0.9); margin: 0; }

      .preview-copy { color: #64748b; font-size: 0.9rem; }

      @media (min-width: 992px) {
        .content-grid {
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          align-items: start;
        }
      }

      @media (max-width: 640px) {
        .status-grid { grid-template-columns: 1fr; }
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
      path: '/app/settings/v27',
      accent: '#5fb2ff'
    },
    {
      code: 'V28',
      title: 'Sonido de alarma',
      description: 'Elige el tono que escuchas en los avisos.',
      path: '/app/settings/v28',
      accent: '#4ecdc4'
    },
    {
      code: 'V29',
      title: 'Notificaciones',
      description: 'Activa o desactiva alertas del sistema.',
      path: '/app/settings/v29',
      accent: '#8bd3ff'
    },
    {
      code: 'V30',
      title: 'Color de la app',
      description: 'Cambia la identidad visual principal.',
      path: '/app/settings/v30',
      accent: '#ff9f1c'
    },
    {
      code: 'V31',
      title: 'Licencias y acerca de',
      description: 'Consulta información técnica y legal.',
      path: '/app/settings/v31',
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