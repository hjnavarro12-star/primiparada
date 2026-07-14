import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent
} from '@ionic/angular/standalone';

import { SupabaseClientService } from '../../core/services/supabase-client.service';
import { AuthService } from '../../core/services/auth.service';

interface UserRow {
  id: string;
  email: string;
  created_at: string;
}

interface ScheduleRow {
  id: string;
  subject: string;
  teacher: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink, SlicePipe, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle],
  template: `
    <ion-content class="ion-padding">
      <div class="admin-container">
        <div class="admin-header">
          <h1>Panel Administrativo</h1>
          <p>Bienvenido, {{ adminEmail() }}. Visualizacion de datos del sistema.</p>
        </div>

        <!-- Tabla: Usuarios registrados -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Usuarios Registrados ({{ users().length }})</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            @if (usersLoading()) {
              <p>Cargando usuarios...</p>
            } @else if (users().length > 0) {
              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (user of users(); track user.id) {
                      <tr>
                        <td>{{ user.email }}</td>
                        <td>{{ user.created_at | slice:0:10 }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p>No hay usuarios registrados.</p>
            }
          </ion-card-content>
        </ion-card>

        <!-- Tabla: Horarios -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Horarios Registrados ({{ schedules().length }})</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            @if (schedulesLoading()) {
              <p>Cargando horarios...</p>
            } @else if (schedules().length > 0) {
              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Asignatura</th>
                      <th>Docente</th>
                      <th>Dia</th>
                      <th>Horario</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of schedules(); track item.id) {
                      <tr>
                        <td>{{ item.subject }}</td>
                        <td>{{ item.teacher || '-' }}</td>
                        <td>{{ dayLabels[item.day_of_week] }}</td>
                        <td>{{ item.start_time }} - {{ item.end_time }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p>No hay horarios registrados.</p>
            }
          </ion-card-content>
        </ion-card>

        <div class="admin-actions">
          <ion-button expand="block" routerLink="/app/dashboard">
            Volver al Dashboard
          </ion-button>
          <ion-button expand="block" fill="outline" (click)="logout()">
            Cerrar Sesion
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    :host { display: block; min-height: 100%; }

    ion-content {
      --background: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 30%, #a0d0c8 60%);
    }

    .admin-container { max-width: 800px; margin: 0 auto; padding: 1.5rem 1rem; }

    .admin-header { margin-bottom: 1.5rem; }
    .admin-header h1 { margin: 0 0 0.25rem; font-size: 1.5rem; font-weight: 700; color: #0a709c; }
    .admin-header p { margin: 0; color: #64748b; font-size: 0.9rem; }

    ion-card {
      margin: 0 0 1rem;
      border-radius: 14px;
      box-shadow: 0 4px 16px rgba(10, 112, 156, 0.1);
      border: none;
      background: linear-gradient(135deg, #0a709c, #3fa779) !important;
      --background: none;
      --color: #ffffff;
      color: #ffffff;
    }

    ion-card-header { --background: transparent; }
    ion-card-title { font-size: 1rem; font-weight: 600; color: #ffffff; }
    ion-card-content { --color: #ffffff; color: #ffffff; }

    .table-wrapper { overflow-x: auto; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }

    th {
      text-align: left;
      padding: 0.5rem;
      color: #e8c843;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }

    td {
      padding: 0.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.9);
    }

    .admin-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .admin-actions ion-button:first-child {
      --background: #e8c843;
      --color: #1a1a2e;
      --border-radius: 12px;
      font-weight: 600;
    }

    .admin-actions ion-button[fill="outline"] {
      --color: #c0392b;
      --border-color: #c0392b;
      --border-radius: 12px;
      font-weight: 600;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPanel implements OnInit {
  private readonly supabase = inject(SupabaseClientService);
  private readonly authService = inject(AuthService);

  protected readonly users = signal<UserRow[]>([]);
  protected readonly schedules = signal<ScheduleRow[]>([]);
  protected readonly usersLoading = signal(true);
  protected readonly schedulesLoading = signal(true);
  protected readonly adminEmail = signal('');

  protected readonly dayLabels: Record<number, string> = {
    0: 'Lun', 1: 'Mar', 2: 'Mie', 3: 'Jue', 4: 'Vie', 5: 'Sab'
  };

  async ngOnInit(): Promise<void> {
    this.adminEmail.set(this.authService.userSnapshot?.email || 'Admin');
    await Promise.all([this.loadUsers(), this.loadSchedules()]);
  }

  private async loadUsers(): Promise<void> {
    try {
      const { data } = await this.supabase.client
        .from('users')
        .select('id, email, created_at')
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) this.users.set(data as UserRow[]);
    } catch { /* silent */ }
    this.usersLoading.set(false);
  }

  private async loadSchedules(): Promise<void> {
    try {
      const { data } = await this.supabase.client
        .from('schedules')
        .select('id, subject, teacher, day_of_week, start_time, end_time')
        .order('day_of_week', { ascending: true })
        .limit(30);
      if (data) this.schedules.set(data as ScheduleRow[]);
    } catch { /* silent */ }
    this.schedulesLoading.set(false);
  }

  protected async logout(): Promise<void> {
    await this.authService.signOut();
    window.location.href = '/access/v1';
  }
}
