import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ScheduleService } from '../../core/services/schedule.service';

@Component({
  selector: 'app-v5-alerts-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="alerts-shell">
      <header class="hero">
        <p class="eyebrow">V5 · Horario</p>
        <h1>Alertas</h1>
        <p class="description">Próximas clases y eventos programados.</p>
      </header>

      <article class="panel">
        <h2>Próxima clase</h2>
        @if (next(); as nextItem) {
          <div>
            <strong>{{ nextItem.subject }}</strong>
            <div>{{ nextItem.teacher }} — {{ nextItem.start_time }} a {{ nextItem.end_time }}</div>
            <div>{{ nextItem.room_label }}</div>
          </div>
        } @else {
          <p>No hay clases programadas.</p>
        }

        <h3 class="list-title">Todas las clases</h3>
        @if (schedules().length > 0) {
          <ul>
            @for (item of schedules(); track item.id) {
              <li>{{ item.subject }} — {{ item.start_time }} (día {{ item.day_of_week }})</li>
            }
          </ul>
        } @else {
          <p>No tienes clases registradas.</p>
        }

        <div class="actions">
          <a routerLink="/alerts/v6">Configurar alertas</a>
          <a routerLink="/schedule/v24">Ir al Gestor</a>
        </div>
      </article>
    </section>
  `,
  styles: [
    `
      .alerts-shell {
        color: #f7fbff;
      }

      .hero,
      .panel {
        background: rgba(12, 16, 31, 0.95);
        padding: 1rem;
        border-radius: 12px;
      }

      .actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V5AlertsPage {
  private readonly scheduleService = inject(ScheduleService);

  protected readonly schedules = toSignal(this.scheduleService.schedules$, { initialValue: [] });
  protected readonly next = toSignal(this.scheduleService.nextClass$, { initialValue: null });
  protected readonly hasSchedules = computed(() => this.schedules().length > 0);
}
