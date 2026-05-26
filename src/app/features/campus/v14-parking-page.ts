import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v14-parking-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section>
      <h1>Parqueadero</h1>
      <p>Carcasa para información de parqueaderos.</p>
      <a routerLink="/campus/v7">Volver</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V14ParkingPage {}
