import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it, beforeEach } from 'vitest';

import { ScheduleService } from './schedule.service';
import { ScheduleSyncService } from './schedule-sync.service';
import { StorageService } from './storage.service';
import type { Schedule } from '../../shared/models/schedule.model';

describe('ScheduleService', () => {
  const queueScheduleChanges = vi.fn().mockResolvedValue(void 0);
  const storageServiceMock = {
    get: async () => null,
    set: async () => void 0,
    remove: async () => void 0
  };

  const scheduleSyncServiceMock = {
    queueSchedules: async () => void 0,
    queueScheduleChanges,
    flushQueue: async () => void 0
  };

  beforeEach(() => {
    queueScheduleChanges.mockClear();
    TestBed.configureTestingModule({
      providers: [
        ScheduleService,
        { provide: StorageService, useValue: storageServiceMock },
        { provide: ScheduleSyncService, useValue: scheduleSyncServiceMock }
      ]
    });
  });

  it('exposes a next class from the BehaviorSubject stream', async () => {
    const service = TestBed.inject(ScheduleService);

    service.setSchedules([
      {
        id: '11111111-1111-4111-8111-111111111111',
        user_id: 'user-0-test',
        subject: 'Introducción a Programación',
        day_of_week: 1,
        start_time: '10:00',
        end_time: '12:00'
      } satisfies Schedule
    ]);

    const nextClass = await firstValueFrom(service.nextClass$);
    expect(nextClass).toBeTruthy();
    expect(nextClass?.subject).toContain('Introducción');
  });

  it('returns null when schedules are empty', async () => {
    const service = TestBed.inject(ScheduleService);
    service.setSchedules([]);

    const nextClass = await firstValueFrom(service.nextClass$);
    expect(nextClass).toBeNull();
  });

  it('queues updates and deletions when the schedule set changes', () => {
    const service = TestBed.inject(ScheduleService);

    service.setSchedules([
      {
        id: '11111111-1111-4111-8111-111111111111',
        user_id: 'user-0-test',
        subject: 'Introducción a Programación',
        day_of_week: 1,
        start_time: '10:00',
        end_time: '12:00'
      } satisfies Schedule
    ]);

    service.update('11111111-1111-4111-8111-111111111111', {
      subject: 'Programación II'
    });

    expect(queueScheduleChanges).toHaveBeenCalledWith(
      expect.objectContaining({
        upserts: [expect.objectContaining({ subject: 'Programación II' })],
        deletions: []
      })
    );

    queueScheduleChanges.mockClear();
    service.delete('11111111-1111-4111-8111-111111111111');

    expect(queueScheduleChanges).toHaveBeenCalledWith(
      expect.objectContaining({
        upserts: [],
        deletions: ['11111111-1111-4111-8111-111111111111']
      })
    );
  });
});
