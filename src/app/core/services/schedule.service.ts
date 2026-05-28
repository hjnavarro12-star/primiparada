import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map, type Observable } from 'rxjs';

import type { Schedule } from '../../shared/models/schedule.model';
import { ScheduleSyncService } from './schedule-sync.service';
import { StorageService } from './storage.service';
import { normalizeScheduleId } from './schedule-id.util';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private readonly storageService = inject(StorageService);
  private readonly scheduleSyncService = inject(ScheduleSyncService);
  private readonly storageKey = 'schedule-service:schedules';
  private readonly schedulesSubject = new BehaviorSubject<Schedule[]>([]);

  readonly schedules$ = this.schedulesSubject.asObservable();

  get schedulesSnapshot(): Schedule[] {
    return this.schedulesSubject.getValue();
  }

  readonly nextClass$: Observable<Schedule | null> = this.schedules$.pipe(
    map((schedules) => this.calculateNextClass(schedules))
  );

  constructor() {
    void this.restoreSchedules();
  }

  setSchedules(schedules: Schedule[]): void {
    const currentSchedules = this.schedulesSubject.getValue();
    const normalizedSchedules = schedules.map((schedule) => ({
      ...schedule,
      id: normalizeScheduleId(schedule.id)
    }));
    const currentById = new Map(currentSchedules.map((schedule) => [schedule.id, schedule]));
    const nextById = new Map(normalizedSchedules.map((schedule) => [schedule.id, schedule]));
    const pendingUpserts = normalizedSchedules.filter((schedule) => {
      const currentSchedule = currentById.get(schedule.id);
      return !currentSchedule || this.hasScheduleChanged(currentSchedule, schedule);
    });
    const pendingDeletions = currentSchedules
      .filter((schedule): schedule is Schedule & { id: string } => typeof schedule.id === 'string')
      .filter((schedule) => !nextById.has(schedule.id))
      .map((schedule) => schedule.id);

    this.schedulesSubject.next(normalizedSchedules);
    void this.storageService.set(this.storageKey, JSON.stringify(normalizedSchedules));
    if (pendingUpserts.length || pendingDeletions.length) {
      void this.scheduleSyncService.queueScheduleChanges({
        upserts: pendingUpserts,
        deletions: pendingDeletions
      });
    }
  }

  add(schedule: Schedule): void {
    this.setSchedules([...this.schedulesSnapshot, schedule]);
  }

  update(id: string, changes: Partial<Schedule>): void {
    this.setSchedules(
      this.schedulesSnapshot.map((schedule) =>
        schedule.id === id ? { ...schedule, ...changes, id: schedule.id } : schedule
      )
    );
  }

  delete(id: string): void {
    this.setSchedules(this.schedulesSnapshot.filter((schedule) => schedule.id !== id));
  }

  async clearPersistedSchedules(): Promise<void> {
    await this.storageService.remove(this.storageKey);
  }

  private async restoreSchedules(): Promise<void> {
    const rawSchedules = await this.storageService.get(this.storageKey);

    if (!rawSchedules) {
      return;
    }

    try {
      const schedules = JSON.parse(rawSchedules) as Schedule[];
      if (Array.isArray(schedules)) {
        const normalizedSchedules = schedules.map((schedule) => ({
          ...schedule,
          id: normalizeScheduleId(schedule.id)
        }));
        this.schedulesSubject.next(normalizedSchedules);
        void this.storageService.set(this.storageKey, JSON.stringify(normalizedSchedules));
      }
    } catch {
      await this.storageService.remove(this.storageKey);
    }
  }

  private calculateNextClass(schedules: Schedule[]): Schedule | null {
    if (!schedules.length) {
      return null;
    }

    const now = new Date();
    const currentDay = this.mapJsDayToAppDay(now.getDay());
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const sorted = [...schedules].sort((a, b) => {
      if (a.day_of_week !== b.day_of_week) {
        return a.day_of_week - b.day_of_week;
      }

      return this.toMinutes(a.start_time) - this.toMinutes(b.start_time);
    });

    const nextInWeek = sorted.find((item) => {
      if (item.day_of_week > currentDay) {
        return true;
      }

      if (item.day_of_week < currentDay) {
        return false;
      }

      return this.toMinutes(item.start_time) >= currentMinutes;
    });

    return nextInWeek ?? sorted[0] ?? null;
  }

  private toMinutes(value: string): number {
    const [hours = '0', minutes = '0'] = value.split(':');
    return Number(hours) * 60 + Number(minutes);
  }

  private mapJsDayToAppDay(jsDay: number): number {
    if (jsDay === 0) {
      return 0;
    }

    return jsDay - 1;
  }

  private hasScheduleChanged(left: Schedule, right: Schedule): boolean {
    return (
      left.subject !== right.subject ||
      (left.teacher ?? '') !== (right.teacher ?? '') ||
      left.day_of_week !== right.day_of_week ||
      left.start_time !== right.start_time ||
      left.end_time !== right.end_time ||
      (left.room_id ?? '') !== (right.room_id ?? '') ||
      (left.semester ?? '') !== (right.semester ?? '') ||
      (left.user_id ?? '') !== (right.user_id ?? '')
    );
  }
}
