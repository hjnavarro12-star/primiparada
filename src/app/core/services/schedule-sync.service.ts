import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';
import { SupabaseClientService } from './supabase-client.service';
import { StorageService } from './storage.service';
import type { Schedule } from '../../shared/models/schedule.model';
import { normalizeScheduleId } from './schedule-id.util';

interface PendingScheduleBatch {
  id: string;
  upserts: Schedule[];
  deletions: string[];
  queuedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ScheduleSyncService {
  private readonly authService = inject(AuthService);
  private readonly supabaseClientService = inject(SupabaseClientService);
  private readonly storageService = inject(StorageService);
  private readonly queueKey = 'schedule-sync-service:queue';
  private readonly authSubscription: Subscription;

  constructor() {
    this.authSubscription = this.authService.session$.subscribe((session) => {
      if (session) {
        void this.flushQueue();
      }
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        void this.flushQueue();
      });
    }
  }

  async queueSchedules(schedules: Schedule[]): Promise<void> {
    await this.queueScheduleChanges({ upserts: schedules });
  }

  async queueScheduleChanges(changes: { upserts?: Schedule[]; deletions?: string[] }): Promise<void> {
    const upserts = (changes.upserts ?? []).map((schedule) => ({
      ...schedule,
      id: normalizeScheduleId(schedule.id)
    }));
    const deletions = Array.from(
      new Set((changes.deletions ?? []).filter((id) => typeof id === 'string' && id.trim().length > 0))
    );

    if (upserts.length === 0 && deletions.length === 0) {
      return;
    }

    const queue = await this.loadQueue();
    queue.push({
      id: normalizeScheduleId(),
      upserts,
      deletions,
      queuedAt: new Date().toISOString()
    });

    await this.saveQueue(queue);
    void this.flushQueue();
  }

  async flushQueue(): Promise<void> {
    const session = this.authService.sessionSnapshot;

    if (!session) {
      return;
    }

    const queue = await this.loadQueue();
    if (!queue.length) {
      return;
    }

    const client = this.supabaseClientService.client;
    const remaining: PendingScheduleBatch[] = [];

    for (const batch of queue) {
      const rows = batch.upserts.map((schedule) => ({
        id: normalizeScheduleId(schedule.id),
        user_id: session.user.id,
        subject: schedule.subject,
        teacher: schedule.teacher ?? null,
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        room_id: schedule.room_id ?? null,
        semester: schedule.semester ?? null
      }));

      if (rows.length) {
        const { error: upsertError } = await client.from('schedules').upsert(rows, { onConflict: 'id' });
        if (upsertError) {
          remaining.push(batch);
          break;
        }
      }

      if (batch.deletions.length) {
        const { error: deleteError } = await client.from('schedules').delete().in('id', batch.deletions);
        if (deleteError) {
          remaining.push(batch);
          break;
        }
      }

      const { error: queueError } = await client.from('schedule_sync_queue').insert({
        user_id: session.user.id,
        operation: 'sync_schedule_changes',
        payload: {
          batch_id: batch.id,
          queued_at: batch.queuedAt,
          upsert_count: rows.length,
          delete_count: batch.deletions.length,
          schedule_ids: rows.map((schedule) => schedule.id),
          deleted_ids: batch.deletions
        },
        synced_at: new Date().toISOString()
      });

      if (queueError) {
        remaining.push(batch);
        break;
      }
    }

    await this.saveQueue(remaining);
  }

  private async loadQueue(): Promise<PendingScheduleBatch[]> {
    const rawQueue = await this.storageService.get(this.queueKey);

    if (!rawQueue) {
      return [];
    }

    try {
      const queue = JSON.parse(rawQueue) as PendingScheduleBatch[];
      return Array.isArray(queue) ? queue : [];
    } catch {
      await this.storageService.remove(this.queueKey);
      return [];
    }
  }

  private async saveQueue(queue: PendingScheduleBatch[]): Promise<void> {
    if (queue.length === 0) {
      await this.storageService.remove(this.queueKey);
      return;
    }

    await this.storageService.set(this.queueKey, JSON.stringify(queue));
  }
}