import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { ScheduleSyncService } from './schedule-sync.service';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

describe('ScheduleSyncService', () => {
  const storage = new Map<string, string>();
  const userSubject = new BehaviorSubject<{ id: string } | null>(null);

  const storageServiceMock = {
    get: async (key: string) => storage.get(key) ?? null,
    set: async (key: string, value: string) => {
      storage.set(key, value);
    },
    remove: async (key: string) => {
      storage.delete(key);
    }
  };

  const authServiceMock = {
    user$: userSubject.asObservable(),
    get userSnapshot() {
      return userSubject.value;
    }
  };

  const post = vi.fn().mockResolvedValue({ synced: true });
  const get = vi.fn().mockResolvedValue([]);

  const apiServiceMock = {
    post,
    get,
  };

  beforeEach(() => {
    storage.clear();
    userSubject.next(null);
    post.mockClear();
    get.mockClear();

    TestBed.configureTestingModule({
      providers: [
        ScheduleSyncService,
        { provide: StorageService, useValue: storageServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ApiService, useValue: apiServiceMock }
      ]
    });
  });

  it('keeps pending batches locally until a user is available', async () => {
    const service = TestBed.inject(ScheduleSyncService);

    await service.queueSchedules([
      {
        id: 'b1d2f5c0-4ef1-4f53-9b5b-4fd0c6c6f001',
        user_id: 'user-0-test',
        subject: 'Cálculo I',
        day_of_week: 0,
        start_time: '08:00',
        end_time: '09:30'
      }
    ]);

    expect(storage.size).toBe(1);
    expect(post).not.toHaveBeenCalled();
  });

  it('flushes pending batches to API when a user appears', async () => {
    const service = TestBed.inject(ScheduleSyncService);

    await service.queueScheduleChanges({
      upserts: [
        {
          id: 'b1d2f5c0-4ef1-4f53-9b5b-4fd0c6c6f001',
          user_id: 'user-0-test',
          subject: 'Cálculo I',
          day_of_week: 0,
          start_time: '08:00',
          end_time: '09:30'
        }
      ],
      deletions: ['c1d2f5c0-4ef1-4f53-9b5b-4fd0c6c6f002']
    });

    userSubject.next({ id: 'user-1' });
    await service.flushQueue();

    expect(post).toHaveBeenCalledWith('/schedules/sync', {
      upserts: [
        expect.objectContaining({
          id: 'b1d2f5c0-4ef1-4f53-9b5b-4fd0c6c6f001',
          subject: 'Cálculo I'
        })
      ],
      deletions: ['c1d2f5c0-4ef1-4f53-9b5b-4fd0c6c6f002']
    });
    expect(storage.size).toBe(0);
  });
});
