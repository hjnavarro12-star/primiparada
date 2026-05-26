import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';

        user_id: 'user-0-test',
import { ScheduleSyncService } from './schedule-sync.service';
import { StorageService } from './storage.service';
import { SupabaseClientService } from './supabase-client.service';

describe('ScheduleSyncService', () => {
  const storage = new Map<string, string>();
  const sessionSubject = new BehaviorSubject<{ user: { id: string } } | null>(null);
  const upsert = vi.fn().mockResolvedValue({ error: null });
  const deleteRows = vi.fn().mockResolvedValue({ error: null });
  const insert = vi.fn().mockResolvedValue({ error: null });

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
    session$: sessionSubject.asObservable(),
    get sessionSnapshot() {
      return sessionSubject.value;
    }
  };

  const supabaseClientMock = {
    client: {
      from: (table: string) => {
        if (table === 'schedules') {
          return { upsert, delete: () => ({ in: deleteRows }) };
        }

        return { insert };
      }
    }
  };

  beforeEach(() => {
    storage.clear();
    sessionSubject.next(null);
    upsert.mockClear();
    deleteRows.mockClear();
    insert.mockClear();

    TestBed.configureTestingModule({
      providers: [
        ScheduleSyncService,
        { provide: StorageService, useValue: storageServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: SupabaseClientService, useValue: supabaseClientMock }
      ]
    });
  });

  it('keeps pending batches locally until a session is available', async () => {
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
    expect(upsert).not.toHaveBeenCalled();
  });

  it('flushes pending batches to Supabase when a session appears', async () => {
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

    sessionSubject.next({ user: { id: 'user-1' } });
    await service.flushQueue();

    expect(upsert).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          id: 'b1d2f5c0-4ef1-4f53-9b5b-4fd0c6c6f001',
          user_id: 'user-1',
          subject: 'Cálculo I'
        })
      ],
      { onConflict: 'id' }
    );
    expect(deleteRows).toHaveBeenCalledWith('id', ['c1d2f5c0-4ef1-4f53-9b5b-4fd0c6c6f002']);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        operation: 'sync_schedule_changes'
      })
    );
    expect(storage.size).toBe(0);
  });
});
