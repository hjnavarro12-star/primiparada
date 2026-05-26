import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from '../../core/services/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { ScheduleSyncService } from '../../core/services/schedule-sync.service';
import { StorageService } from '../../core/services/storage.service';
import { SupabaseClientService } from '../../core/services/supabase-client.service';
import { V21ManualEntryPage } from './v21-manual-entry-page';

describe('V21ManualEntryPage', () => {
  let scheduleService: ScheduleService;
  const sessionSubject = new BehaviorSubject<{ user: { id: string } } | null>({ user: { id: 'user-0-test' } });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V21ManualEntryPage],
      providers: [
        provideRouter([]),
        { provide: StorageService, useValue: { get: async () => null, set: async () => void 0, remove: async () => void 0 } },
        { provide: AuthService, useValue: { session$: sessionSubject.asObservable(), sessionSnapshot: { user: { id: 'user-0-test' } } } },
        {
          provide: SupabaseClientService,
          useValue: { client: { from: () => ({ upsert: vi.fn().mockResolvedValue({ error: null }), delete: () => ({ in: vi.fn() }), insert: vi.fn() }) } }
        },
        { provide: ScheduleSyncService, useValue: { queueScheduleChanges: vi.fn().mockResolvedValue(void 0) } }
      ]
    }).compileComponents();

    scheduleService = TestBed.inject(ScheduleService);
    scheduleService.setSchedules([]);
  });

  it('renders one empty class row and lets the user add another', () => {
    const fixture = TestBed.createComponent(V21ManualEntryPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Ingreso manual');
    expect(fixture.componentInstance.classControls().length).toBe(1);

    fixture.componentInstance.addClass();
    fixture.detectChanges();

    expect(fixture.componentInstance.classControls().length).toBe(2);
  });

  it('persists manual rows into the schedule service', () => {
    const fixture = TestBed.createComponent(V21ManualEntryPage);
    fixture.detectChanges();

    const firstGroup = fixture.componentInstance.classControls().at(0);
    firstGroup.patchValue({
      subject: 'Cálculo I',
      teacher: 'Docente Demo',
      day_of_week: 2,
      start_time: '08:00',
      end_time: '09:30',
      room_label: 'Bloque 16 - 201'
    });

    fixture.componentInstance.save();

    expect(scheduleService.schedulesSnapshot).toHaveLength(1);
    expect(scheduleService.schedulesSnapshot[0].subject).toBe('Cálculo I');
    expect(fixture.componentInstance.message()).toContain('Horario guardado');
  });
});