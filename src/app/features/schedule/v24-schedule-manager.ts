import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { ScheduleService } from '../../core/services/schedule.service';
import { AuthService } from '../../core/services/auth.service';
import { createScheduleId } from '../../core/services/schedule-id.util';
import type { DayOfWeek, Schedule } from '../../shared/models/schedule.model';
import { dayLabel } from '../../shared/utils/day-label.util';

type ScheduleViewMode = 'table' | 'cards';

type CalendarDay = {
  day: DayOfWeek;
  label: string;
  items: Schedule[];
};

type CalendarSlot = {
  key: string;
  label: string;
  startMinutes: number;
  endMinutes: number;
};

type CalendarGridRow = {
  key: string;
  label: string;
  cells: Array<{
    day: DayOfWeek;
    items: Schedule[];
  }>;
};

@Component({
  selector: 'app-v24-schedule-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="schedule-shell">
      <header class="hero">
        <h1>Gestor de horario</h1>
        <p class="description">Administra tu horario en tabla o tarjetas y agrega clases sin salir de la vista.</p>

        <div class="toolbar" role="group" aria-label="Cambiar vista del horario">
          <button type="button" class="toggle" [class.active]="mode() === 'table'" (click)="setMode('table')">Tabla</button>
          <button type="button" class="toggle" [class.active]="mode() === 'cards'" (click)="setMode('cards')">Cards</button>
          <button type="button" class="toggle" [class.active]="compactCalendar()" (click)="toggleCompactCalendar()">
            {{ compactCalendar() ? 'Reactivo: sí' : 'Reactivo: no' }}
          </button>
        </div>
      </header>

      <div class="panel" [class.cards-mode]="mode() === 'cards'">
        @if (mode() === 'table') {
          @if (calendarGrid().days.length && calendarGrid().rows.length) {
            <div class="table-responsive">
              <table class="schedule-table schedule-grid">
                <thead>
                  <tr>
                    <th>Hora</th>
                    @for (day of calendarGrid().days; track day.day) {
                      <th>{{ day.label }}</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  @for (row of calendarGrid().rows; track row.key) {
                    <tr>
                      <th class="time-slot">{{ row.label }}</th>
                      @for (cell of row.cells; track cell.day) {
                        <td>
                          @if (cell.items.length) {
                            @for (item of cell.items; track item.id) {
                              <article class="class-pill">
                                <div class="class-pill-header">
                                  <strong>{{ item.subject }}</strong>
                                  <div class="pill-actions">
                                    <button type="button" class="pill-link" (click)="editSchedule(item)">Editar</button>
                                    <button type="button" class="pill-link danger" (click)="removeSchedule(item.id)">Eliminar</button>
                                  </div>
                                </div>
                                <span>{{ item.start_time }} - {{ item.end_time }}</span>
                                <small>{{ item.room_label || 'Sala por definir' }}</small>
                              </article>
                            }
                          } @else {
                            <span class="empty">—</span>
                          }
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <p class="empty-copy">Sin clases.</p>
          }
        } @else {
          <div class="cards-grid">
            @for (day of cardDays(); track day.day) {
              <article class="day-card">
                <h2>{{ day.label }}</h2>
                @if (day.items.length) {
                  @for (item of day.items; track item.id) {
                    <div class="schedule-item">
                      <div class="class-pill-header">
                        <strong>{{ item.subject }}</strong>
                        <div class="pill-actions">
                          <button type="button" class="pill-link" (click)="editSchedule(item)">Editar</button>
                          <button type="button" class="pill-link danger" (click)="removeSchedule(item.id)">Eliminar</button>
                        </div>
                      </div>
                      <p>{{ item.start_time }} - {{ item.end_time }}</p>
                      <small>{{ item.room_label || 'Sala por definir' }}</small>
                    </div>
                  }
                } @else {
                  <p class="empty-copy">Sin clases.</p>
                }
              </article>
            }
          </div>
        }
      </div>

      <aside class="creator">
        <h2>{{ editingId() ? 'Editar clase' : 'Añadir clase' }}</h2>
        <form [formGroup]="scheduleForm" (ngSubmit)="addClass()" class="creator-form">
          <label>
            <span>Asignatura</span>
            <input type="text" formControlName="subject" placeholder="Ej: Álgebra" />
          </label>

          <label>
            <span>Docente</span>
            <input type="text" formControlName="teacher" placeholder="Docente" />
          </label>

          <label>
            <span>Día</span>
            <select formControlName="day_of_week">
              @for (day of days; track day.value) {
                <option [ngValue]="day.value">{{ day.short }}</option>
              }
            </select>
          </label>

          <div class="grid-two">
            <label>
              <span>Inicio</span>
              <input type="time" formControlName="start_time" />
            </label>
            <label>
              <span>Fin</span>
              <input type="time" formControlName="end_time" />
            </label>
          </div>

          <label>
            <span>Sala</span>
            <input type="text" formControlName="room_label" placeholder="Bloque 16 - 201" />
          </label>

          <button type="submit" [disabled]="scheduleForm.invalid">{{ editingId() ? 'Guardar cambios' : 'Añadir clase' }}</button>
          @if (editingId()) {
            <button type="button" class="secondary" (click)="cancelEdit()">Cancelar edición</button>
          }
        </form>

        @if (message()) {
          <p class="feedback" role="status">{{ message() }}</p>
        }

        <a routerLink="/app/dashboard" class="back-link">Volver al dashboard</a>
      </aside>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100%;
        background-color: #a0d0c8;
        background-image: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 30%, #a0d0c8 60%);
        background-size: 100% 100vh;
        background-repeat: no-repeat;
      }

      .schedule-shell {
        display: grid;
        gap: 1.25rem;
        padding: 1.25rem;
        color: #1a1a2e;
      }

      .hero {
        border-radius: 14px;
        background: linear-gradient(135deg, #0a709c, #3fa779) !important;
        padding: 1.25rem;
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.1);
      }

      .hero .eyebrow {
        margin: 0 0 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: #e8c843;
        font-size: 0.75rem;
      }

      .hero h1 { margin: 0 0 0.25rem; font-size: 1.4rem; font-weight: 700; color: #ffffff; }
      .hero .description { margin: 0; color: rgba(255,255,255,0.9); font-size: 0.9rem; }

      .toolbar {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .toggle {
        min-height: 40px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.1);
        color: #ffffff;
        font: inherit;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        font-size: 0.85rem;
      }

      .toggle.active {
        background: #e8c843;
        color: #1a1a2e;
        font-weight: 700;
        border-color: #e8c843;
      }

      .panel {
        border-radius: 14px;
        background: linear-gradient(135deg, #0a709c, #3fa779) !important;
        padding: 1rem;
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.1);
      }

      .creator {
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.85);
        padding: 1.25rem;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.08);
        color: #1a1a2e;
      }

      .creator h2 { margin: 0 0 0.75rem; font-size: 1.1rem; color: #0a709c; }

      h1, h2, p { margin-top: 0; }

      .table-responsive { overflow-x: auto; }

      .schedule-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0.5rem;
      }

      .schedule-table th {
        text-align: left;
        color: #e8c843;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .schedule-table td { vertical-align: top; min-width: 130px; }

      .class-pill, .schedule-item {
        border-radius: 10px;
        padding: 0.6rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
      }

      .class-pill-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .pill-actions { display: flex; gap: 0.3rem; flex-wrap: wrap; }

      .pill-link {
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.08);
        color: #ffffff;
        font: inherit;
        padding: 0.3rem 0.5rem;
        font-size: 0.75rem;
        cursor: pointer;
        min-height: auto;
      }

      .pill-link.danger { color: #ffb0b0; }

      .class-pill { display: grid; gap: 0.2rem; margin-bottom: 0.5rem; }
      .class-pill strong, .schedule-item strong { font-size: 0.9rem; color: #ffffff; }
      .class-pill span, .schedule-item p, .schedule-item small { margin: 0; opacity: 0.9; color: rgba(255,255,255,0.85); }

      .empty { opacity: 0.55; color: rgba(255,255,255,0.6); }
      .empty-copy { color: rgba(255,255,255,0.7); }

      .cards-grid {
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      }

      .day-card {
        border-radius: 12px;
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }

      .day-card h2 { font-size: 0.95rem; color: #e8c843; margin-bottom: 0.5rem; }

      .schedule-item + .schedule-item { margin-top: 0.5rem; }

      .creator-form { display: grid; gap: 0.7rem; }

      .creator label { display: grid; gap: 0.3rem; }
      .creator label span { font-weight: 600; font-size: 0.8rem; color: #0a709c; text-transform: uppercase; }

      .creator input, .creator select {
        min-height: 44px;
        border-radius: 10px;
        border: 1px solid rgba(10, 112, 156, 0.2);
        padding: 0.6rem 0.75rem;
        background: #ffffff;
        color: #1a1a2e;
        font: inherit;
      }

      .grid-two {
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .creator button[type='submit'] {
        min-height: 48px;
        border-radius: 12px;
        border: none;
        background: #e8c843;
        color: #1a1a2e;
        font-weight: 600;
        font: inherit;
        cursor: pointer;
        padding: 0.75rem;
      }

      .creator button[type='submit']:disabled { opacity: 0.5; cursor: not-allowed; }

      .secondary {
        min-height: 44px;
        border-radius: 12px;
        border: 2px solid #0a709c;
        background: transparent;
        color: #0a709c;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
        padding: 0.6rem;
      }

      .feedback { color: #0a709c; font-weight: 500; margin: 0.5rem 0 0; }

      .back-link {
        display: inline-block;
        margin-top: 0.5rem;
        text-decoration: none;
        color: #0a709c;
        font-weight: 600;
      }

      @media (min-width: 992px) {
        .schedule-shell {
          grid-template-columns: minmax(0, 1.5fr) minmax(300px, 0.7fr);
          align-items: start;
        }
        .hero { grid-column: 1 / -1; }
      }

      @media (max-width: 640px) {
        .grid-two { grid-template-columns: 1fr; }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V24ScheduleManager implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly scheduleService = inject(ScheduleService);
  private readonly authService = inject(AuthService);
  private readonly scheduleSubscription = new Subscription();

  protected readonly mode = signal<ScheduleViewMode>('table');
  protected readonly compactCalendar = signal(true);
  protected readonly message = signal('');
  protected readonly schedules = signal<Schedule[]>([]);
  protected readonly editingId = signal<string | null>(null);
  protected readonly days = [
    { value: 0, short: 'Lun' },
    { value: 1, short: 'Mar' },
    { value: 2, short: 'Mié' },
    { value: 3, short: 'Jue' },
    { value: 4, short: 'Vie' },
    { value: 5, short: 'Sáb' }
  ];

  protected readonly scheduleForm = this.fb.nonNullable.group({
    subject: ['', [Validators.required]],
    teacher: [''],
    day_of_week: [0 as DayOfWeek, [Validators.required]],
    start_time: ['', [Validators.required]],
    end_time: ['', [Validators.required]],
    room_label: ['']
  });

  protected readonly calendarGrid = computed(() => this.buildCalendarGrid(this.schedules(), this.compactCalendar()));

  protected readonly cardDays = computed(() => {
    return this.buildCalendarDays(this.schedules(), this.compactCalendar());
  });

  ngOnInit(): void {
    this.scheduleSubscription.add(
      this.scheduleService.schedules$.subscribe((items) => {
        this.schedules.set(items);
      })
    );
  }

  ngOnDestroy(): void {
    this.scheduleSubscription.unsubscribe();
  }

  protected setMode(mode: ScheduleViewMode): void {
    this.mode.set(mode);
  }

  protected toggleCompactCalendar(): void {
    this.compactCalendar.update((value) => !value);
  }

  protected addClass(): void {
    this.message.set('');

    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      this.message.set('Completa asignatura, día y horarios para guardar.');
      return;
    }

    const { subject, teacher, day_of_week, start_time, end_time, room_label } = this.scheduleForm.getRawValue();
    const userId = this.authService.userSnapshot?.id;

    if (!userId) {
      this.message.set('Inicia sesión para guardar cambios sobre tu horario real.');
      return;
    }

    const nextSchedule: Schedule = {
      id: this.editingId() ?? createScheduleId('schedule'),
      user_id: userId,
      subject,
      teacher: teacher || undefined,
      day_of_week,
      start_time,
      end_time,
      room_label: room_label || undefined
    };

    if (this.editingId()) {
      this.scheduleService.update(this.editingId()!, nextSchedule);
      this.message.set('Clase actualizada de forma local y encolada para sincronización.');
    } else {
      this.scheduleService.add(nextSchedule);
      this.message.set('Clase agregada al horario de forma local y encolada para sincronización.');
    }

    this.scheduleForm.reset({
      subject: '',
      teacher: '',
      day_of_week: 0,
      start_time: '',
      end_time: '',
      room_label: ''
    });
    this.editingId.set(null);
  }

  protected editSchedule(schedule: Schedule): void {
    this.editingId.set(schedule.id ?? null);
    this.scheduleForm.reset({
      subject: schedule.subject,
      teacher: schedule.teacher ?? '',
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      room_label: schedule.room_label ?? ''
    });
    this.message.set(`Editando ${schedule.subject}.`);
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
    this.scheduleForm.reset({
      subject: '',
      teacher: '',
      day_of_week: 0,
      start_time: '',
      end_time: '',
      room_label: ''
    });
    this.message.set('Edición cancelada.');
  }

  protected removeSchedule(id?: string): void {
    if (!id) {
      return;
    }

    this.scheduleService.delete(id);
    if (this.editingId() === id) {
      this.cancelEdit();
    }
    this.message.set('Clase eliminada y marcada para sincronización.');
  }

  private buildCalendarDays(schedules: Schedule[], compact: boolean): CalendarDay[] {
    const renderedDays = compact ? this.getActiveDays(schedules) : this.getWeekDays();

    return renderedDays.map((day) => ({
      day,
      label: dayLabel(day),
      items: schedules.filter((item) => item.day_of_week === day)
    }));
  }

  private buildCalendarGrid(schedules: Schedule[], compact: boolean): { days: CalendarDay[]; rows: CalendarGridRow[] } {
    const days = compact ? this.getActiveDays(schedules) : this.getWeekDays();
    const rows = this.buildTimeRows(schedules, compact).map((slot) => ({
      key: slot.key,
      label: slot.label,
      cells: days.map((day) => ({
        day,
        items: schedules.filter((item) => item.day_of_week === day && this.overlapsSlot(item, slot))
      }))
    }));

    return {
      days: days.map((day) => ({
        day,
        label: dayLabel(day),
        items: schedules.filter((item) => item.day_of_week === day)
      })),
      rows
    };
  }

  private buildTimeRows(schedules: Schedule[], compact: boolean): CalendarSlot[] {
    if (!schedules.length) {
      return [];
    }

    const startMinutes = this.floorToHalfHour(Math.min(...schedules.map((item) => this.toMinutes(item.start_time))));
    const endMinutes = this.ceilToHalfHour(Math.max(...schedules.map((item) => this.toMinutes(item.end_time))));
    const slots: CalendarSlot[] = [];

    for (let minute = startMinutes; minute < endMinutes; minute += 30) {
      const slot: CalendarSlot = {
        key: `slot-${minute}`,
        label: `${this.formatMinutes(minute)} - ${this.formatMinutes(minute + 30)}`,
        startMinutes: minute,
        endMinutes: minute + 30
      };

      if (!compact || this.hasSchedulesInSlot(schedules, slot)) {
        slots.push(slot);
      }
    }

    return slots;
  }

  private hasSchedulesInSlot(schedules: Schedule[], slot: CalendarSlot): boolean {
    return schedules.some((item) => this.overlapsSlot(item, slot));
  }

  private overlapsSlot(schedule: Schedule, slot: CalendarSlot): boolean {
    const start = this.toMinutes(schedule.start_time);
    const end = this.toMinutes(schedule.end_time);
    return start < slot.endMinutes && end > slot.startMinutes;
  }

  private getWeekDays(): DayOfWeek[] {
    return [0, 1, 2, 3, 4, 5];
  }

  private getActiveDays(schedules: Schedule[]): DayOfWeek[] {
    return this.getWeekDays().filter((day) => schedules.some((item) => item.day_of_week === day));
  }

  private floorToHalfHour(minutes: number): number {
    return Math.floor(minutes / 30) * 30;
  }

  private ceilToHalfHour(minutes: number): number {
    return Math.ceil(minutes / 30) * 30;
  }

  private toMinutes(value: string): number {
    const [hours = '0', minutes = '0'] = value.split(':');
    return Number(hours) * 60 + Number(minutes);
  }

  private formatMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  protected dayLabel(day: number): string {
    return dayLabel(day);
  }
}