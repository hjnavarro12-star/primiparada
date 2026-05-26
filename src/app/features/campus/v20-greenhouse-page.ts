import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v20-greenhouse-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section>
      <h1>Invernaderos</h1>
      <p>Carcasa para invernaderos y zonas verdes del campus.</p>
      <a routerLink="/campus/v7">Volver</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V20GreenhousePage {}
