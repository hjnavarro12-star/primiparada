import { Component, OnDestroy, OnInit, inject, computed, signal } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  MenuController,
  AlertController
} from '@ionic/angular/standalone';
import { App as CapacitorApp } from '@capacitor/app';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  notificationsOutline,
  calendarOutline,
  locationOutline,
  navigateOutline,
  settingsOutline,
  logOutOutline,
  chevronDownOutline,
  chevronForwardOutline
} from 'ionicons/icons';

import { AuthService } from './core/services/auth.service';

interface NavSection {
  label: string;
  icon: string;
  route?: string;
  children?: NavChild[];
}

interface NavChild {
  label: string;
  route: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonApp,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly menuCtrl = inject(MenuController);
  private readonly alertController = inject(AlertController);
  private readonly authService = inject(AuthService);
  private backButtonHandle: { remove: () => Promise<void> } | null = null;

  protected readonly isSignedIn = computed(() => this.authService.isSignedIn());

  protected readonly expandedSection = signal<string | null>(null);

  protected readonly navSections: NavSection[] = [
    { label: 'Dashboard', icon: 'home-outline', route: '/access/v4' },
    { label: 'Alertas', icon: 'notifications-outline', route: '/alerts/v5' },
    {
      label: 'Mi Horario', icon: 'calendar-outline',
      children: [
        { label: 'Gestor de Horario', route: '/schedule/v24' },
        { label: 'Digitar manualmente', route: '/schedule/v21' },
        { label: 'Escanear PDF', route: '/schedule/v22' },
        { label: 'Escanear imagen', route: '/schedule/v23' }
      ]
    },
    {
      label: 'Lugares', icon: 'location-outline',
      children: [
        { label: 'Directorio', route: '/campus/v7' },
        { label: 'Baños', route: '/campus/v8' },
        { label: 'Biblioteca', route: '/campus/v9' },
        { label: 'Cafetería', route: '/campus/v10' },
        { label: 'Sendero turístico', route: '/campus/v11' },
        { label: 'Gimnasio', route: '/campus/v12' },
        { label: 'Bienestar', route: '/campus/v13' },
        { label: 'Parqueadero', route: '/campus/v14' },
        { label: 'Entrada/Salida', route: '/campus/v15' },
        { label: 'Auditorio 1', route: '/campus/v16' },
        { label: 'Auditorio 2', route: '/campus/v17' },
        { label: 'Laboratorio 1', route: '/campus/v18' },
        { label: 'Laboratorio 2', route: '/campus/v19' },
        { label: 'Invernaderos', route: '/campus/v20' }
      ]
    },
    { label: 'Rutas', icon: 'navigate-outline', route: '/campus/v25' },
    {
      label: 'Configuración', icon: 'settings-outline',
      children: [
        { label: 'General', route: '/settings/v26' },
        { label: 'Tamaño de letra', route: '/settings/v27' },
        { label: 'Sonido de alarma', route: '/settings/v28' },
        { label: 'Notificaciones', route: '/settings/v29' },
        { label: 'Color de la app', route: '/settings/v30' },
        { label: 'Licencias', route: '/settings/v31' }
      ]
    }
  ];

  constructor() {
    addIcons({
      homeOutline,
      notificationsOutline,
      calendarOutline,
      locationOutline,
      navigateOutline,
      settingsOutline,
      logOutOutline,
      chevronDownOutline,
      chevronForwardOutline
    });
  }

  ngOnInit(): void {
    void this.registerBackButtonListener();
  }

  async ngOnDestroy(): Promise<void> {
    if (this.backButtonHandle) {
      await this.backButtonHandle.remove();
    }
  }

  protected toggleSection(label: string): void {
    this.expandedSection.update(current => current === label ? null : label);
  }

  protected navigateTo(route: string): void {
    void this.menuCtrl.close();
    void this.router.navigateByUrl(route);
  }

  protected async logout(): Promise<void> {
    await this.menuCtrl.close();
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

  private async registerBackButtonListener(): Promise<void> {
    this.backButtonHandle = await CapacitorApp.addListener('backButton', () => {
      void this.handleBackButton();
    });
  }

  private async handleBackButton(): Promise<void> {
    const currentUrl = this.router.url;

    if (currentUrl === '/access/v1' || currentUrl === '/access/v4') {
      const alert = await this.alertController.create({
        header: '¿Salir de la aplicación?',
        message: 'Estás a punto de cerrar Primiparada.',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Salir', role: 'destructive' }
        ]
      });
      await alert.present();
      const result = await alert.onDidDismiss();
      if (result.role === 'destructive') {
        await CapacitorApp.exitApp();
      }
      return;
    }

    this.location.back();
  }
}
