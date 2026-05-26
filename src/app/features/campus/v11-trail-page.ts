import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v11-trail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="campus-shell">
      <header class="hero">
        <p class="eyebrow">V11 · Campus</p>
        <h1>Sendero Turístico</h1>
        <p class="description">Carcasa para recorrido turístico del campus; mapa a integrar en fases posteriores.</p>
      </header>

      <article class="panel">
        <div class="placeholder">Descripción del sendero y puntos de interés (carcasa).</div>

        <div class="actions">
          <a routerLink="/campus/v10">Anterior</a>
          <a routerLink="/campus/v12">Siguiente</a>
        </div>
      </article>
    </section>
  `,
  styles: [`.placeholder { padding:1rem; background: rgba(255,255,255,0.02); border-radius:8px }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V11TrailPage {}
