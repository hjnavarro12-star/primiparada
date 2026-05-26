import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v10-cafeteria-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="campus-shell">
      <header class="hero">
        <p class="eyebrow">V10 · Campus</p>
        <h1>Cafetería / Restaurante</h1>
        <p class="description">Carcasa para menús, horarios y servicios de alimentación del campus.</p>
      </header>

      <article class="panel">
        <div class="placeholder">Aquí se integrará el menú y horarios de la cafetería.</div>

        <div class="actions">
          <a routerLink="/campus/v9">Anterior</a>
          <a routerLink="/campus/v11">Siguiente</a>
        </div>
      </article>
    </section>
  `,
  styles: [`.placeholder { padding:1rem; background: rgba(255,255,255,0.02); border-radius:8px }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V10CafeteriaPage {}
