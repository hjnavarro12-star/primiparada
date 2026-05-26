import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v12-gym-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="campus-shell">
      <header class="hero">
        <p class="eyebrow">V12 · Campus</p>
        <h1>Gimnasio</h1>
        <p class="description">Carcasa para información del gimnasio y horarios de uso.</p>
      </header>

      <article class="panel">
        <div class="placeholder">Horarios y servicios del gimnasio (carcasa).</div>

        <div class="actions">
          <a routerLink="/campus/v11">Anterior</a>
          <a routerLink="/campus/v13">Siguiente</a>
        </div>
      </article>
    </section>
  `,
  styles: [`.placeholder { padding:1rem; background: rgba(255,255,255,0.02); border-radius:8px }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V12GymPage {}
