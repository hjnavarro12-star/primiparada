import { Injectable, inject } from '@angular/core';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';

import { ScheduleService } from './schedule.service';
import { StorageService } from './storage.service';
import type { Schedule } from '../../shared/models/schedule.model';

interface AlertConfig {
  minutes: number;
  vibration: boolean;
  sound: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationSchedulerService {
  private readonly scheduleService = inject(ScheduleService);
  private readonly storage = inject(StorageService);
  private readonly configKey = 'primiparada.settings.alerts';

  /**
   * Programa (o reprograma) todas las notificaciones de clases.
   * Llamar después de:
   * - Login exitoso
   * - Guardar/editar horario
   * - Cambiar configuración de alertas
   */
  async scheduleAll(): Promise<void> {
    const config = await this.getConfig();
    if (!config || config.minutes <= 0) return;

    await this.cancelAll();

    const schedules = this.scheduleService.schedulesSnapshot;
    if (!schedules || schedules.length === 0) return;

    const notifications: ScheduleOptions['notifications'] = [];
    const now = new Date();

    for (const schedule of schedules) {
      const nextOccurrence = this.getNextOccurrence(schedule, now);
      if (!nextOccurrence) continue;

      const notifyAt = new Date(nextOccurrence.getTime() - config.minutes * 60 * 1000);

      // Solo programar si la notificación es en el futuro
      if (notifyAt.getTime() <= now.getTime()) continue;

      notifications.push({
        id: this.generateId(schedule),
        title: `📚 ${schedule.subject} en ${config.minutes} min`,
        body: `Salón: ${schedule.room_label || 'Por definir'} — ${schedule.start_time}`,
        schedule: { at: notifyAt },
        sound: config.sound ? undefined : '',
        extra: { scheduleId: schedule.id }
      });
    }

    if (notifications.length === 0) return;

    try {
      const permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions();
        if (req.display !== 'granted') return;
      }

      await LocalNotifications.schedule({ notifications });
    } catch (error) {
      // En browser web, LocalNotifications no está disponible — silenciar
      console.warn('[NotificationScheduler] No se pudieron programar notificaciones:', error);
    }
  }

  /** Cancela todas las notificaciones programadas */
  async cancelAll(): Promise<void> {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }
    } catch {
      // Silenciar en browser
    }
  }

  /** Obtiene la configuración de alertas del storage local */
  private async getConfig(): Promise<AlertConfig | null> {
    try {
      const raw = await this.storage.get(this.configKey);
      if (!raw) return { minutes: 15, vibration: true, sound: true };
      return JSON.parse(raw) as AlertConfig;
    } catch {
      return { minutes: 15, vibration: true, sound: true };
    }
  }

  /**
   * Calcula la próxima ocurrencia de una clase a partir de ahora.
   * day_of_week: 0=Lunes, 1=Martes, ..., 5=Sábado
   */
  private getNextOccurrence(schedule: Schedule, now: Date): Date | null {
    if (!schedule.start_time) return null;

    const [hours, minutes] = schedule.start_time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    // JS: 0=Domingo, 1=Lunes, ..., 6=Sábado
    // App: 0=Lunes, 1=Martes, ..., 5=Sábado
    const targetJsDay = schedule.day_of_week + 1;

    const result = new Date(now);
    const currentJsDay = result.getDay();

    let daysUntil = targetJsDay - currentJsDay;
    if (daysUntil < 0) daysUntil += 7;
    if (daysUntil === 0) {
      // Mismo día — verificar si la hora ya pasó
      const classTime = new Date(now);
      classTime.setHours(hours, minutes, 0, 0);
      if (classTime.getTime() <= now.getTime()) {
        daysUntil = 7; // Siguiente semana
      }
    }

    result.setDate(result.getDate() + daysUntil);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  /** Genera un ID numérico único para una notificación */
  private generateId(schedule: Schedule): number {
    let hash = 0;
    const str = `${schedule.id}-${schedule.day_of_week}`;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
