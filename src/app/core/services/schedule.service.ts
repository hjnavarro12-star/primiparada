import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map, type Observable, Subscription } from 'rxjs';

import type { Schedule } from '../../shared/models/schedule.model';
import { ScheduleSyncService } from './schedule-sync.service';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { normalizeScheduleId } from './schedule-id.util';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private readonly storageService = inject(StorageService);
  private readonly scheduleSyncService = inject(ScheduleSyncService);
  private readonly authService = inject(AuthService);
  private readonly schedulesSubject = new BehaviorSubject<Schedule[]>([]);
  private readonly authSubscription: Subscription;
  private currentUserId: string | null = null;

  readonly schedules$ = this.schedulesSubject.asObservable();

  get schedulesSnapshot(): Schedule[] {
    return this.schedulesSubject.getValue();
  }

  readonly nextClass$: Observable<Schedule | null> = this.schedules$.pipe(
    map((schedules) => this.calculateNextClass(schedules))
  );

  constructor() {
    // Escuchar cambios de usuario para cargar/limpiar horarios
    this.authSubscription = this.authService.user$.subscribe((user) => {
      if (user && user.id !== this.currentUserId) {
        this.currentUserId = user.id;
        void this.restoreSchedules();
      } else if (!user && this.currentUserId) {
        // Sesión cerrada — limpiar estado en memoria (no borrar storage del usuario)
        this.currentUserId = null;
        this.schedulesSubject.next([]);
      }
    });
  }

  /**
   * Clave de storage por usuario. Cada usuario tiene su propio almacén.
   */
  private get storageKey(): string {
    if (this.currentUserId) {
      return `schedule-service:schedules:${this.currentUserId}`;
    }
    return 'schedule-service:schedules';
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

  /**
   * Limpia los horarios del usuario actual del storage local.
   * Se llama al cerrar sesión para evitar datos fantasma.
   */
  async clearPersistedSchedules(): Promise<void> {
    await this.storageService.remove(this.storageKey);
    // Limpiar también la clave legacy (global) si existiera
    await this.storageService.remove('schedule-service:schedules');
    this.schedulesSubject.next([]);
  }

  private async restoreSchedules(): Promise<void> {
    // Intentar cargar con la clave específica del usuario
    let rawSchedules = await this.storageService.get(this.storageKey);

    // Migración: si no hay datos en la clave por usuario, buscar en la clave legacy
    if (!rawSchedules && this.currentUserId) {
      const legacyRaw = await this.storageService.get('schedule-service:schedules');
      if (legacyRaw) {
        try {
          const legacySchedules = JSON.parse(legacyRaw) as Schedule[];
          // Solo migrar si los horarios pertenecen a este usuario
          const userSchedules = legacySchedules.filter(
            (s) => s.user_id === this.currentUserId
          );
          if (userSchedules.length > 0) {
            rawSchedules = JSON.stringify(userSchedules);
            // Guardar en la nueva clave por usuario
            await this.storageService.set(this.storageKey, rawSchedules);
          }
          // Limpiar clave legacy para evitar confusión
          await this.storageService.remove('schedule-service:schedules');
        } catch {
          await this.storageService.remove('schedule-service:schedules');
        }
      }
    }

    if (!rawSchedules) {
      this.schedulesSubject.next([]);
      return;
    }

    try {
      const schedules = JSON.parse(rawSchedules) as Schedule[];
      if (Array.isArray(schedules)) {
        // Filtrar solo los horarios de este usuario (seguridad extra)
        const userSchedules = this.currentUserId
          ? schedules.filter((s) => s.user_id === this.currentUserId)
          : schedules;
        const normalizedSchedules = userSchedules.map((schedule) => ({
          ...schedule,
          id: normalizeScheduleId(schedule.id)
        }));
        this.schedulesSubject.next(normalizedSchedules);
        void this.storageService.set(this.storageKey, JSON.stringify(normalizedSchedules));
      }
    } catch {
      await this.storageService.remove(this.storageKey);
      this.schedulesSubject.next([]);
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

    if (currentDay < 0) {
      return sorted[0] ?? null;
    }

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

  /**
   * Convierte un día de JavaScript (0=Domingo … 6=Sábado) al dominio de la app
   * (0=Lunes … 5=Sábado). Devuelve -1 cuando el día es domingo porque la app
   * no incluye domingo en su modelo de horario.
   */
  private mapJsDayToAppDay(jsDay: number): number {
    if (jsDay === 0) {
      return -1;
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
