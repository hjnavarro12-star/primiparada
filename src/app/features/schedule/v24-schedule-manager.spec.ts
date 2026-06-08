import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { V24ScheduleManager } from './v24-schedule-manager';
import { ScheduleSyncService } from '../../core/services/schedule-sync.service';
import { StorageService } from '../../core/services/storage.service';
import { ApiService } from '../../core/services/api.service';

describe('V24ScheduleManager', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V24ScheduleManager],
      providers: [
        provideRouter([]),
        {
          provide: StorageService,
          useValue: {
            get: async () => null,
            set: async () => void 0,
            remove: async () => void 0
          }
        },
        {
          provide: AuthService,
          useValue: {
            user$: undefined,
            userSnapshot: { id: 'user-0-test' },
            signOut: vi.fn().mockResolvedValue(void 0)
          }
        },
        {
          provide: ApiService,
          useValue: {
            post: vi.fn().mockResolvedValue({}),
            get: vi.fn().mockResolvedValue([])
          }
        },
        { provide: ScheduleSyncService, useValue: { queueScheduleChanges: vi.fn().mockResolvedValue(void 0) } }
      ]
    }).compileComponents();
  });

  it('renders an empty schedule in table mode', () => {
    const fixture = TestBed.createComponent(V24ScheduleManager);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Introducción a Programación');
    expect(fixture.nativeElement.textContent).toContain('Tabla');
    expect(fixture.nativeElement.textContent).not.toContain('Domingo');
  });

  it('hides empty days and slots by default, then expands when reactive mode is off', () => {
    const scheduleService = TestBed.inject(ScheduleService);
    scheduleService.add({
      id: 'a1111111-1111-4111-8111-111111111111',
      user_id: 'user-0-test',
      subject: 'Álgebra Lineal',
      teacher: 'Docente Demo',
      day_of_week: 1,
      start_time: '08:00',
      end_time: '09:30',
      room_label: 'Bloque 16 - 201'
    });
    scheduleService.add({
      id: 'b1111111-1111-4111-8111-111111111111',
      user_id: 'user-0-test',
      subject: 'Lógica',
      teacher: 'Docente Demo',
      day_of_week: 4,
      start_time: '11:00',
      end_time: '12:00',
      room_label: 'Bloque 12 - 101'
    });

    const fixture = TestBed.createComponent(V24ScheduleManager);
    fixture.detectChanges();

    const component = fixture.componentInstance as {
      toggleCompactCalendar(): void;
      calendarGrid(): { days: Array<{ label: string }>; rows: unknown[] };
    };

    expect(component.calendarGrid().days.map((day) => day.label)).toEqual(['Martes', 'Viernes']);

    component.toggleCompactCalendar();
    fixture.detectChanges();

    expect(component.calendarGrid().days.map((day) => day.label)).toEqual([
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado'
    ]);
  });

  it('switches to cards mode and adds a new class', () => {
    const fixture = TestBed.createComponent(V24ScheduleManager);
    fixture.detectChanges();

    (fixture.componentInstance as { setMode(mode: 'table' | 'cards'): void }).setMode('cards');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Cards');

    fixture.componentInstance.scheduleForm.setValue({
      subject: 'Cálculo I',
      teacher: 'Docente Demo',
      day_of_week: 2,
      start_time: '08:00',
      end_time: '09:30',
      room_label: 'Bloque 16 - 201'
    });

    (fixture.componentInstance as { addClass(): void }).addClass();
    fixture.detectChanges();

    expect(fixture.componentInstance.message()).toContain('Clase agregada');
    expect(TestBed.inject(ScheduleService).schedulesSnapshot).toHaveLength(1);
    expect(TestBed.inject(ScheduleService).schedulesSnapshot[0].subject).toBe('Cálculo I');
  });

  it('can edit and delete an existing class', () => {
    const scheduleService = TestBed.inject(ScheduleService);
    scheduleService.add({
      id: '11111111-1111-4111-8111-111111111111',
      user_id: 'user-0-test',
      subject: 'Introducción a Programación',
      teacher: 'Docente asignado',
      day_of_week: 1,
      start_time: '10:00',
      end_time: '12:00',
      room_label: 'Bloque 16 - 201'
    });

    const fixture = TestBed.createComponent(V24ScheduleManager);
    fixture.detectChanges();

    const component = fixture.componentInstance as {
      editSchedule(schedule: {
        id?: string;
        subject: string;
        teacher?: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
        room_label?: string;
      }): void;
      addClass(): void;
      removeSchedule(id?: string): void;
      scheduleForm: { setValue(value: unknown): void };
      message(): string;
    };

    component.editSchedule(scheduleService.schedulesSnapshot[0]);

    component.scheduleForm.setValue({
      subject: 'Introducción a Programación II',
      teacher: 'Docente asignado',
      day_of_week: 1,
      start_time: '10:00',
      end_time: '12:00',
      room_label: 'Bloque 16 - 202'
    });

    component.addClass();
    fixture.detectChanges();

    expect(component.message()).toContain('actualizada');
    expect(scheduleService.schedulesSnapshot[0].subject).toBe('Introducción a Programación II');

    component.removeSchedule('11111111-1111-4111-8111-111111111111');
    fixture.detectChanges();

    expect(component.message()).toContain('eliminada');
    expect(TestBed.inject(ScheduleService).schedulesSnapshot).toHaveLength(0);
  });
});
