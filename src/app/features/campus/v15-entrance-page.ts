import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v15-entrance-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section>
      <h1>Entrada / Salida</h1>
      <p>Carcasa para accesos principales.</p>
      <a routerLink="/campus/v7">Volver</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V15EntrancePage {}
