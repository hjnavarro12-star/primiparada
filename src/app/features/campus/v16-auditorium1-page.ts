import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v16-auditorium1-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section>
      <h1>Auditorio 1</h1>
      <p>Carcasa para auditorio 1.</p>
      <a routerLink="/campus/v7">Volver</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V16Auditorium1Page {}
