import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScheduleService } from '../../core/services/schedule.service';

@Component({
  selector: 'app-v5-alerts-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="alerts-shell">
      <header class="hero">
        <p class="eyebrow">V5 · Horario</p>
        <h1>Alertas</h1>
        <p class="description">Próximas clases y eventos programados.</p>
      </header>

      <article class="panel">
        <h2>Próxima clase</h2>
        <div *ngIf="next; else empty">
          <strong>{{ next.subject }}</strong>
          <div>{{ next.teacher }} — {{ next.start_time }} a {{ next.end_time }}</div>
          <div>{{ next.room_label }}</div>
        </div>
        <ng-template #empty>
          <p>No hay clases programadas.</p>
        </ng-template>

        <h3 class="list-title">Todas las clases</h3>
        <ul>
          <li *ngFor="let s of schedules">{{ s.subject }} — {{ s.start_time }} (día {{ s.day_of_week }})</li>
        </ul>

        <div class="actions">
          <a routerLink="/alerts/v6">Configurar alertas</a>
          <a routerLink="/schedule/v24">Ir al Gestor</a>
        </div>
      </article>
    </section>
  `,
  styles: [
    `
      .alerts-shell { color:#f7fbff }
      .hero, .panel { background: rgba(12,16,31,0.95); padding:1rem; border-radius:12px }
      .actions { margin-top:1rem; display:flex; gap:0.5rem }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V5AlertsPage {
  private readonly scheduleService = inject(ScheduleService);

  protected readonly schedules = this.scheduleService.schedulesSnapshot;
  protected readonly next = null as unknown as any;

  constructor() {
    this.scheduleService.nextClass$.subscribe((n) => {
      (this as any).next = n;
    });
  }
}
