import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v31-licenses-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="lic-shell">
      <header class="hero">
        <h1>Licencias Open Source</h1>
        <p class="description">Listado de dependencias y licencias usadas en la aplicación.</p>
      </header>

      <article class="panel">
        <ol>
          <li>Angular — MIT</li>
          <li>Vitest — MIT</li>
          <li>@testing-library/angular — MIT</li>
        </ol>

        <div class="actions">
          <a routerLink="/app/settings/v26" class="back-link">Volver</a>
        </div>
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

      .lic-shell { color: #1a1a2e; display: grid; gap: 1rem; padding: 1.25rem; }

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

      .panel ol { padding-left: 1.25rem; margin: 0; }
      .panel li { padding: 0.4rem 0; color: #1a1a2e; }

      .actions { margin-top: 1rem; }
      a.back-link { color: #0a709c; text-decoration: none; font-weight: 600; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V31LicensesPage {}
