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
    <div class="page-content">
      <div class="page-header">
        <h2>📝 Ingreso Manual</h2>
        <p>Carga tu horario con filas dinámicas. Cada fila se guarda en el horario local.</p>
      </div>

      <form class="manual-form" [formGroup]="manualForm" (ngSubmit)="save()">
        <div formArrayName="classes" class="classes-list">
          @for (group of classControls().controls; track $index) {
            <article class="class-card" [formGroupName]="$index">
              <div class="card-header">
                <h3>Clase {{ $index + 1 }}</h3>
                <button type="button" class="btn-remove" (click)="removeClass($index)" [disabled]="classControls().length === 1">
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
          <button type="button" class="btn-secondary" (click)="addClass()">Añadir otra clase</button>
          <button type="submit" class="btn-primary" [disabled]="manualForm.invalid">Guardar horario</button>
        </div>
      </form>

      @if (message()) {
        <p class="feedback" role="status">{{ message() }}</p>
      }

      <div class="nav-actions">
        <a routerLink="/app/schedule/v24" class="back-link">Ir al gestor de horario</a>
      </div>
    </div>
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

      .page-content {
        padding: 1.25rem;
      }

      .page-header {
        margin-bottom: 1.25rem;
      }

      .page-header h2 {
        margin: 0 0 0.25rem;
        font-size: 1.4rem;
        font-weight: 700;
        color: #0a709c;
      }

      .page-header p {
        margin: 0;
        color: #64748b;
        font-size: 0.9rem;
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
        border-radius: 14px;
        background: linear-gradient(135deg, #0a709c, #3fa779) !important;
        padding: 1rem;
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(10, 112, 156, 0.1);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .card-header h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #ffffff;
      }

      .btn-remove {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
        border: none;
        border-radius: 8px;
        padding: 0.4rem 0.75rem;
        font-size: 0.8rem;
        cursor: pointer;
      }

      .btn-remove:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .grid {
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      label {
        display: grid;
        gap: 0.3rem;
      }

      label span {
        font-weight: 600;
        font-size: 0.8rem;
        color: #e8c843;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      input,
      select {
        min-height: 44px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0.6rem 0.75rem;
        font: inherit;
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }

      input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      select option {
        color: #1a1a2e;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .btn-primary {
        min-height: 48px;
        border-radius: 12px;
        border: none;
        padding: 0.75rem 1.25rem;
        font: inherit;
        cursor: pointer;
        background: #e8c843;
        color: #1a1a2e;
        font-weight: 600;
      }

      .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-secondary {
        min-height: 48px;
        border-radius: 12px;
        border: 2px solid #0a709c;
        padding: 0.75rem 1.25rem;
        font: inherit;
        cursor: pointer;
        background: transparent;
        color: #0a709c;
        font-weight: 600;
      }

      .feedback {
        margin-top: 0.75rem;
        color: #0a709c;
        font-weight: 500;
      }

      .nav-actions {
        margin-top: 1rem;
      }

      .back-link {
        color: #0a709c;
        text-decoration: none;
        font-weight: 600;
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