import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

import { AuthService } from '../../../core/services/auth.service';

interface NavChild {
  label: string;
  route: string;
}

interface NavSection {
  label: string;
  icon: string;
  route?: string;
  children?: NavChild[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly alertController = inject(AlertController);

  sidebarOpen = false;
  readonly expandedSection = signal<string | null>(null);

  readonly navSections: NavSection[] = [
    { label: 'Dashboard', icon: '🏠', route: '/app/dashboard' },
    { label: 'Alertas', icon: '🔔', route: '/app/alerts/v5' },
    {
      label: 'Mi Horario', icon: '📅',
      children: [
        { label: 'Gestor de Horario', route: '/app/schedule/v24' },
        { label: 'Digitar manualmente', route: '/app/schedule/v21' },
        { label: 'Escanear PDF', route: '/app/schedule/v22' },
        { label: 'Escanear imagen', route: '/app/schedule/v23' }
      ]
    },
    {
      label: 'Lugares', icon: '📍',
      children: [
        { label: 'Directorio', route: '/app/campus/v7' },
        { label: 'Baños', route: '/app/campus/v8' },
        { label: 'Biblioteca', route: '/app/campus/v9' },
        { label: 'Cafetería', route: '/app/campus/v10' },
        { label: 'Sendero turístico', route: '/app/campus/v11' },
        { label: 'Gimnasio', route: '/app/campus/v12' },
        { label: 'Bienestar', route: '/app/campus/v13' },
        { label: 'Parqueadero', route: '/app/campus/v14' },
        { label: 'Entrada/Salida', route: '/app/campus/v15' },
        { label: 'Auditorio 1', route: '/app/campus/v16' },
        { label: 'Auditorio 2', route: '/app/campus/v17' },
        { label: 'Laboratorio 1', route: '/app/campus/v18' },
        { label: 'Laboratorio 2', route: '/app/campus/v19' },
        { label: 'Invernaderos', route: '/app/campus/v20' }
      ]
    },
    { label: 'Rutas', icon: '🗺️', route: '/app/campus/v25' },
    {
      label: 'Configuración', icon: '⚙️',
      children: [
        { label: 'General', route: '/app/settings/v26' },
        { label: 'Tamaño de letra', route: '/app/settings/v27' },
        { label: 'Sonido de alarma', route: '/app/settings/v28' },
        { label: 'Notificaciones', route: '/app/settings/v29' },
        { label: 'Color de la app', route: '/app/settings/v30' },
        { label: 'Licencias', route: '/app/settings/v31' }
      ]
    }
  ];

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      if (window.innerWidth < 992) {
        this.sidebarOpen = false;
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  toggleSection(label: string): void {
    this.expandedSection.update(current => current === label ? null : label);
  }

  navigateTo(route: string): void {
    void this.router.navigateByUrl(route);
    this.closeSidebar();
  }

  async logout(): Promise<void> {
    const alert = await this.alertController.create({
      header: '¿Cerrar sesión?',
      message: 'Tu sesión se cerrará y volverás al inicio.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Cerrar sesión', role: 'destructive' }
      ]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result.role === 'destructive') {
      await this.authService.signOut();
      await this.router.navigateByUrl('/access/v1');
    }
  }
}
