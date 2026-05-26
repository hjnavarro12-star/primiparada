import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v8-bathrooms-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="campus-shell">
      <header class="hero">
        <p class="eyebrow">V8 · Campus</p>
        <h1>Baños</h1>
        <p class="description">Ubicación de baños cercanos y accesos rápidos dentro del campus.</p>
      </header>

      <article class="panel">
        <div class="card">
          <strong>Bloque principal</strong>
          <p>Servicio sanitario en planta baja, cerca de la entrada norte.</p>
        </div>
        <div class="card">
          <strong>Bloque académico</strong>
          <p>Baños en segundo piso, junto a las escaleras centrales.</p>
        </div>

        <div class="actions">
          <a routerLink="/campus/v7">Volver al directorio</a>
          <a routerLink="/campus/v9">Siguiente vista</a>
        </div>
      </article>
    </section>
  `,
  styles: [
    `
      .campus-shell { color:#f7fbff; display:grid; gap:1rem }
      .hero, .panel { background: rgba(12,16,31,0.95); padding:1rem; border-radius:12px }
      .panel { display:grid; gap:0.75rem }
      .card { background: rgba(255,255,255,0.04); border-radius:10px; padding:0.85rem }
      .actions { display:flex; gap:0.75rem; flex-wrap:wrap }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V8BathroomsPage {}
