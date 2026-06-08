import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';
import { ApiService } from './api.service';
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
  private readonly apiService = inject(ApiService);
  private readonly storageService = inject(StorageService);
  private readonly queueKey = 'schedule-sync-service:queue';
  private readonly authSubscription: Subscription;

  constructor() {
    this.authSubscription = this.authService.user$.subscribe((user) => {
      if (user) {
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
    const user = this.authService.userSnapshot;

    if (!user) {
      return;
    }

    const queue = await this.loadQueue();
    if (!queue.length) {
      return;
    }

    const remaining: PendingScheduleBatch[] = [];

    for (const batch of queue) {
      try {
        await this.apiService.post('/schedules/sync', {
          upserts: batch.upserts,
          deletions: batch.deletions
        });
      } catch {
        remaining.push(batch);
        break;
      }
    }

    await this.saveQueue(remaining);
  }

  async fetchSchedules(): Promise<Schedule[]> {
    return this.apiService.get<Schedule[]>('/schedules');
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
