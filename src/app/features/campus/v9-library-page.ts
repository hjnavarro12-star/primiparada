import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v9-library-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="campus-shell">
      <header class="hero">
        <p class="eyebrow">V9 · Campus</p>
        <h1>Biblioteca</h1>
        <p class="description">Carcasa para contenido de la biblioteca (novedades, horarios, catálogo).</p>
      </header>

      <article class="panel">
        <div class="placeholder">Aquí se integrará el catálogo / noticias de la biblioteca.</div>

        <div class="actions">
          <a routerLink="/campus/v7">Volver al directorio</a>
          <a routerLink="/campus/v10">Siguiente</a>
        </div>
      </article>
    </section>
  `,
  styles: [
    `
      .placeholder { padding:1rem; background: rgba(255,255,255,0.02); border-radius:8px }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V9LibraryPage {}
