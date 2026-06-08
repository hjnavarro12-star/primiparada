import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ScheduleService } from '../../core/services/schedule.service';
import { AuthService } from '../../core/services/auth.service';
import { createScheduleId } from '../../core/services/schedule-id.util';
import type { DayOfWeek, Schedule } from '../../shared/models/schedule.model';
import { dayLabel } from '../../shared/utils/day-label.util';

@Component({
  selector: 'app-v21-manual-entry-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="manual-shell">
      <header class="hero">
        <p class="eyebrow">V21 · Horario</p>
        <h1>Ingreso manual</h1>
        <p class="description">
          Carga tu horario con filas dinámicas. Cada fila se guarda en el horario local para que luego aparezca en V24.
        </p>
      </header>

      <form class="manual-form" [formGroup]="manualForm" (ngSubmit)="save()">
        <div formArrayName="classes" class="classes-list">
          @for (group of classControls().controls; track $index) {
            <article class="class-card" [formGroupName]="$index">
              <div class="card-header">
                <h2>Clase {{ $index + 1 }}</h2>
                <button type="button" class="ghost" (click)="removeClass($index)" [disabled]="classControls().length === 1">
                  Eliminar
                </button>
              </div>

              <div class="grid">
                <label>
                  <span>Asignatura</span>
                  <input type="text" formControlName="subject" placeholder="Ej: Cálculo I" />
                </label>

                <label>
                  <span>Docente</span>
                  <input type="text" formControlName="teacher" placeholder="Docente" />
                </label>

                <label>
                  <span>Día</span>
                  <select formControlName="day_of_week">
                    @for (day of days; track day.value) {
                      <option [ngValue]="day.value">{{ day.label }}</option>
                    }
                  </select>
                </label>

                <label>
                  <span>Salón</span>
                  <input type="text" formControlName="room_label" placeholder="Bloque 16 - 201" />
                </label>

                <label>
                  <span>Hora inicio</span>
                  <input type="time" formControlName="start_time" />
                </label>

                <label>
                  <span>Hora fin</span>
                  <input type="time" formControlName="end_time" />
                </label>
              </div>
            </article>
          }
        </div>

        <div class="actions">
          <button type="button" class="ghost primary" (click)="addClass()">Añadir otra clase</button>
          <button type="submit" [disabled]="manualForm.invalid">Guardar horario</button>
        </div>
      </form>

      @if (message()) {
        <p class="feedback" role="status">{{ message() }}</p>
      }

      <a routerLink="/schedule/v24" class="back-link">Ir al gestor de horario</a>
    </section>
  `,
  styles: [
    `
      .manual-shell {
        display: grid;
        gap: 1rem;
        color: #f7fbff;
      }

      .hero,
      .class-card {
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: linear-gradient(180deg, rgba(12, 16, 31, 0.95), rgba(8, 12, 22, 0.98));
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
      }

      .hero {
        padding: 1.25rem;
      }

      .eyebrow {
        margin: 0 0 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: #8bd3ff;
        font-size: 0.75rem;
      }

      h1,
      h2,
      p {
        margin-top: 0;
      }

      .description {
        margin-bottom: 0;
      }

      .manual-form {
        display: grid;
        gap: 1rem;
      }

      .classes-list {
        display: grid;
        gap: 1rem;
      }

      .class-card {
        padding: 1rem;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .card-header h2 {
        margin: 0;
        font-size: 1rem;
      }

      .grid {
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      label {
        display: grid;
        gap: 0.4rem;
      }

      label span {
        font-weight: 600;
      }

      input,
      select,
      button {
        min-height: 48px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 0.75rem 0.9rem;
        font: inherit;
      }

      input,
      select {
        background: rgba(255, 255, 255, 0.06);
        color: inherit;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      button {
        cursor: pointer;
        background: linear-gradient(135deg, #8bd3ff, #4ecdc4);
        color: #08111e;
        font-weight: 700;
      }

      .ghost {
        background: rgba(255, 255, 255, 0.05);
        color: inherit;
      }

      .ghost.primary {
        border-color: rgba(139, 211, 255, 0.5);
      }

      button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .feedback,
      .back-link {
        color: #8bd3ff;
      }

      .back-link {
        text-decoration: none;
      }

      @media (min-width: 992px) {
        .manual-shell {
          grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.8fr);
          align-items: start;
        }

        .hero,
        .manual-form,
        .feedback,
        .back-link {
          grid-column: 1 / -1;
        }
      }

      @media (max-width: 640px) {
        .grid {
          grid-template-columns: 1fr;
        }

        .actions {
          flex-direction: column;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V21ManualEntryPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly scheduleService = inject(ScheduleService);
  private readonly authService = inject(AuthService);

  protected readonly message = signal('');
  protected readonly days = [0, 1, 2, 3, 4, 5].map((value) => ({ value, label: dayLabel(value) }));

  protected readonly manualForm = this.fb.group({
    classes: this.fb.array([this.createClassGroup()])
  });

  ngOnInit(): void {
    this.message.set('Usa “Añadir otra clase” para crear más filas y luego “Guardar horario”.');
  }

  protected classControls(): FormArray {
    return this.manualForm.controls.classes as FormArray;
  }

  protected addClass(): void {
    this.classControls().push(this.createClassGroup());
  }

  protected removeClass(index: number): void {
    if (this.classControls().length > 1) {
      this.classControls().removeAt(index);
    }
  }

  protected save(): void {
    this.message.set('');

    if (this.manualForm.invalid) {
      this.manualForm.markAllAsTouched();
      this.message.set('Completa las filas antes de guardar el horario.');
      return;
    }

    const userId = this.authService.userSnapshot?.id;

    if (!userId) {
      this.message.set('Inicia sesión para guardar un horario real.');
      return;
    }

    const currentSchedules = this.scheduleService.schedulesSnapshot;
    const items = this.classControls().controls.map((control) => {
      const value = control.getRawValue() as {
        subject: string;
        teacher: string;
        day_of_week: DayOfWeek;
        start_time: string;
        end_time: string;
        room_label: string;
      };

      const nextItem: Schedule = {
        id: createScheduleId('manual'),
        user_id: userId,
        subject: value.subject,
        teacher: value.teacher || undefined,
        day_of_week: value.day_of_week,
        start_time: value.start_time,
        end_time: value.end_time,
        room_label: value.room_label || undefined
      };

      return nextItem;
    });

    this.scheduleService.setSchedules([...currentSchedules, ...items]);
    this.resetRows();
    this.message.set(`Horario guardado con ${items.length} clase(s) nuevas.`);
  }

  private createClassGroup() {
    return this.fb.group({
      subject: ['', [Validators.required]],
      teacher: [''],
      day_of_week: [0 as DayOfWeek, [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      room_label: ['']
    });
  }

  private resetRows(): void {
    while (this.classControls().length > 0) {
      this.classControls().removeAt(0);
    }

    this.classControls().push(this.createClassGroup());
  }
}