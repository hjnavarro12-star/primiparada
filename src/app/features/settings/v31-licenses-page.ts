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
        <p class="eyebrow">V31 · Configuración</p>
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
          <a routerLink="/settings/v26" class="back-link">Volver</a>
        </div>
      </article>
    </section>
  `,
  styles: [
    `
      .lic-shell { color:#f7fbff; display:grid; gap:1rem }
      .hero, .panel { background: rgba(12,16,31,0.95); padding:1rem; border-radius:12px }
      .actions { margin-top:1rem }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V31LicensesPage {}
