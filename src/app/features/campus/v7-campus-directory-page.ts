import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v7-campus-directory-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="campus-shell">
      <header class="hero">
        <p class="eyebrow">V7 · Campus</p>
        <h1>Directorio de Lugares</h1>
        <p class="description">Explora los puntos clave del campus y abre cada vista específica.</p>
      </header>

      <article class="panel">
        <div class="grid">
          <a class="card" routerLink="/campus/v8">Baños</a>
          <a class="card" routerLink="/campus/v9">Biblioteca</a>
          <a class="card" routerLink="/campus/v10">Cafetería / Restaurante</a>
          <a class="card" routerLink="/campus/v11">Sendero Turístico</a>
          <a class="card" routerLink="/campus/v12">Gimnasio</a>
          <a class="card" routerLink="/campus/v13">Bienestar Universitario</a>
          <a class="card" routerLink="/campus/v14">Parqueadero</a>
          <a class="card" routerLink="/campus/v15">Entrada / Salida</a>
          <a class="card" routerLink="/campus/v16">Auditorio 1</a>
          <a class="card" routerLink="/campus/v17">Auditorio 2</a>
          <a class="card" routerLink="/campus/v18">Laboratorio 1</a>
          <a class="card" routerLink="/campus/v19">Laboratorio 2</a>
          <a class="card" routerLink="/campus/v20">Invernaderos</a>
          <a class="card" routerLink="/campus/v25">Navegación en Tiempo Real</a>
        </div>
      </article>
    </section>
  `,
  styles: [
    `
      .campus-shell { color:#f7fbff; display:grid; gap:1rem }
      .hero, .panel { background: rgba(12,16,31,0.95); padding:1rem; border-radius:12px }
      .grid { display:grid; gap:0.75rem; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
      .card { display:block; padding:0.9rem; border-radius:10px; background: rgba(255,255,255,0.04); text-decoration:none; color:inherit }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V7CampusDirectoryPage {}
