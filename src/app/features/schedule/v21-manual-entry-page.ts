import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ScheduleService } from '../../core/services/schedule.service';
import { AuthService } from '../../core/services/auth.service';
import { SupabaseClientService } from '../../core/services/supabase-client.service';
import { createScheduleId } from '../../core/services/schedule-id.util';
import type { DayOfWeek, Jornada, Schedule } from '../../shared/models/schedule.model';
import { dayLabel } from '../../shared/utils/day-label.util';

@Component({
  selector: 'app-v21-manual-entry-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>Ingreso Manual</h2>
        <p>Registra tus clases una por una. Cada clase se guarda y sincroniza automáticamente.</p>
      </div>

      <!-- Contador de clases guardadas -->
      @if (savedCount() > 0) {
        <div class="saved-badge">
          📚 {{ savedCount() }} clase(s) registrada(s) en tu horario
        </div>
      }

      <!-- Formulario de una sola clase -->
      <article class="class-card">
        <div class="card-header">
          <h3>Clase {{ nextClassNumber() }}</h3>
          <button type="button" class="btn-clear" (click)="clearForm()">
            Vaciar
          </button>
        </div>

        <form [formGroup]="classForm" (ngSubmit)="saveClass()" class="grid">
          <label [class.invalid]="isFieldInvalid('subject')">
            <span>Asignatura *</span>
            <input type="text" formControlName="subject" placeholder="Ej: Cálculo I" />
            @if (isFieldInvalid('subject')) {
              <small class="error-msg">Campo obligatorio</small>
            }
          </label>

          <label>
            <span>Docente</span>
            <input type="text" formControlName="teacher" placeholder="Nombre del docente" />
          </label>

          <label>
            <span>Día *</span>
            <select formControlName="day_of_week">
              @for (day of days; track day.value) {
                <option [ngValue]="day.value">{{ day.label }}</option>
              }
            </select>
          </label>

          <label>
            <span>Jornada</span>
            <select formControlName="jornada">
              <option value="diurna">Diurna</option>
              <option value="nocturna">Nocturna</option>
              <option value="sabatina">Sabatina</option>
            </select>
          </label>

          <label>
            <span>Salón</span>
            @if (rooms().length > 0) {
              <select formControlName="room_label">
                <option value="">Seleccionar salón</option>
                @for (room of rooms(); track room) {
                  <option [value]="room">{{ room }}</option>
                }
              </select>
            } @else {
              <input type="text" formControlName="room_label" placeholder="Bloque 16 - Salón 201" />
            }
          </label>

          <label [class.invalid]="isFieldInvalid('start_time')">
            <span>Hora inicio *</span>
            <input type="time" formControlName="start_time" />
            @if (isFieldInvalid('start_time')) {
              <small class="error-msg">Requerido</small>
            }
          </label>

          <label [class.invalid]="isFieldInvalid('end_time')">
            <span>Hora fin *</span>
            <input type="time" formControlName="end_time" />
            @if (isFieldInvalid('end_time')) {
              <small class="error-msg">Requerido</small>
            }
          </label>

          @if (timeError()) {
            <div class="time-error">
              ⚠️ {{ timeError() }}
            </div>
          }

          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="classForm.invalid || !!timeError()">
              Guardar clase
            </button>
          </div>
        </form>
      </article>

      @if (message()) {
        <p class="feedback" [class.success]="isSuccess()" role="status">{{ message() }}</p>
      }

      <div class="nav-actions">
        <a routerLink="/app/schedule/v24" class="back-link">← Ir al gestor de horario</a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
      background-color: #a0d0c8;
      background-image: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 30%, #a0d0c8 60%);
      background-size: 100% 100vh;
      background-repeat: no-repeat;
    }

    .page-content { padding: 1.25rem; }
    .page-header { margin-bottom: 1rem; }
    .page-header h2 { margin: 0 0 0.25rem; font-size: 1.4rem; font-weight: 700; color: #0a709c; }
    .page-header p { margin: 0; color: #64748b; font-size: 0.9rem; }

    .saved-badge {
      background: rgba(10, 112, 156, 0.1);
      border: 1px solid rgba(10, 112, 156, 0.2);
      border-radius: 10px;
      padding: 0.6rem 1rem;
      margin-bottom: 1rem;
      color: #0a709c;
      font-weight: 600;
      font-size: 0.85rem;
      text-align: center;
    }

    .class-card {
      border-radius: 14px;
      background: linear-gradient(135deg, #0a709c, #3fa779) !important;
      padding: 1rem;
      color: #ffffff;
      box-shadow: 0 4px 16px rgba(10, 112, 156, 0.1);
    }

    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .card-header h3 { margin: 0; font-size: 1rem; font-weight: 600; color: #ffffff; }

    .btn-clear {
      background: rgba(255, 255, 255, 0.15); color: #ffffff; border: none;
      border-radius: 8px; padding: 0.4rem 0.75rem; font-size: 0.8rem; cursor: pointer;
    }

    .grid { display: grid; gap: 0.75rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }

    label { display: grid; gap: 0.3rem; }
    label span { font-weight: 600; font-size: 0.8rem; color: #e8c843; text-transform: uppercase; letter-spacing: 0.03em; }

    input, select {
      min-height: 44px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.6rem 0.75rem; font: inherit; background: rgba(255, 255, 255, 0.1); color: #ffffff;
    }
    input::placeholder { color: rgba(255, 255, 255, 0.5); }
    select option { color: #1a1a2e; }

    .form-actions { grid-column: 1 / -1; }

    .btn-primary {
      width: 100%; min-height: 48px; border-radius: 12px; border: none;
      padding: 0.75rem 1.25rem; font: inherit; cursor: pointer;
      background: #e8c843; color: #1a1a2e; font-weight: 600;
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .feedback { margin-top: 0.75rem; color: #0a709c; font-weight: 500; }
    .feedback.success { color: #2e7d32; }
    .nav-actions { margin-top: 1rem; }
    .back-link { color: #0a709c; text-decoration: none; font-weight: 600; }

    label.invalid input, label.invalid select {
      border-color: #ff6b6b !important;
      background: rgba(255, 107, 107, 0.08) !important;
    }
    .error-msg { color: #ff6b6b; font-size: 0.75rem; font-weight: 500; margin: 0; }
    .time-error {
      grid-column: 1 / -1;
      background: rgba(255, 107, 107, 0.15);
      border: 1px solid rgba(255, 107, 107, 0.3);
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      color: #ff6b6b;
      font-size: 0.85rem;
      font-weight: 500;
    }

    @media (max-width: 640px) {
      .grid { grid-template-columns: 1fr; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V21ManualEntryPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly scheduleService = inject(ScheduleService);
  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseClientService);

  protected readonly message = signal('');
  protected readonly rooms = signal<string[]>([]);
  protected readonly savedCount = signal(0);
  protected readonly nextClassNumber = computed(() => this.savedCount() + 1);
  protected readonly days = [0, 1, 2, 3, 4, 5].map((value) => ({ value, label: dayLabel(value) }));
  protected readonly isSuccess = signal(false);
  protected readonly timeError = signal('');

  protected readonly classForm = this.fb.nonNullable.group({
    subject: ['', [Validators.required]],
    teacher: [''],
    day_of_week: [0 as DayOfWeek, [Validators.required]],
    jornada: ['diurna' as Jornada],
    start_time: ['', [Validators.required]],
    end_time: ['', [Validators.required]],
    room_label: ['']
  });

  ngOnInit(): void {
    this.savedCount.set(this.scheduleService.schedulesSnapshot.length);
    this.loadRooms();
    this.classForm.valueChanges.subscribe(() => {
      const start = this.classForm.get('start_time')?.value;
      const end = this.classForm.get('end_time')?.value;
      if (start && end && end <= start) {
        this.timeError.set('La hora de fin debe ser posterior a la hora de inicio.');
      } else {
        this.timeError.set('');
      }
    });
  }

  private async loadRooms(): Promise<void> {
    try {
      const { data } = await this.supabase.client
        .from('rooms')
        .select('code, block')
        .order('block', { ascending: true });
      if (data && data.length > 0) {
        const labels = data.map((r: { block: string; code: string }) => r.block + ' - ' + r.code);
        this.rooms.set(labels);
      }
    } catch {
      // Sin conexion a BD
    }
  }

  protected clearForm(): void {
    this.classForm.reset({
      subject: '',
      teacher: '',
      day_of_week: 0,
      jornada: 'diurna',
      start_time: '',
      end_time: '',
      room_label: ''
    });
    this.message.set('Formulario vaciado.');
    this.isSuccess.set(false);
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const control = this.classForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  protected saveClass(): void {
    this.message.set('');
    this.isSuccess.set(false);

    if (this.classForm.invalid) {
      this.classForm.markAllAsTouched();
      this.message.set('Completa los campos obligatorios marcados con *.');
      return;
    }

    if (this.timeError()) {
      this.message.set(this.timeError());
      return;
    }

    const userId = this.authService.userSnapshot?.id;

    if (!userId) {
      this.message.set('Inicia sesion para guardar.');
      return;
    }

    const value = this.classForm.getRawValue();

    const newClass: Schedule = {
      id: createScheduleId('manual'),
      user_id: userId,
      subject: value.subject,
      teacher: value.teacher || undefined,
      day_of_week: value.day_of_week,
      jornada: value.jornada,
      start_time: value.start_time,
      end_time: value.end_time,
      room_label: value.room_label || undefined
    };

    this.scheduleService.add(newClass);
    this.savedCount.update((n) => n + 1);

    this.classForm.reset({
      subject: '',
      teacher: '',
      day_of_week: 0,
      jornada: 'diurna',
      start_time: '',
      end_time: '',
      room_label: ''
    });

    this.isSuccess.set(true);
    this.message.set(`✓ Clase "${newClass.subject}" guardada. Puedes registrar la siguiente.`);
  }
}
