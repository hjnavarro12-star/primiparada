import { Location, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { App as CapacitorApp } from '@capacitor/app';
import { filter } from 'rxjs';

import { AuthService } from './core/services/auth.service';
import { VIEW_GROUPS, VIEW_SPECS } from './view-catalog';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly alertController = inject(AlertController);
  private readonly authService = inject(AuthService);
  private backButtonHandle: { remove: () => Promise<void> } | null = null;

  // Keep view catalog references available internally
  protected readonly totalViews = VIEW_SPECS.length;
  protected readonly navigationGroups = VIEW_GROUPS;
  protected readonly sprintHighlights = [
    'Angular 21 standalone en shell limpio',
    'Rutas V1-V31 lazy-load listadas',
    'Base lista para Supabase y fases siguientes'
  ];

  // Layout state
  protected readonly sidebarOpen = signal(false);
  protected readonly isAuthenticatedRoute = signal(false);

  protected readonly isSignedIn = computed(() => this.authService.isSignedIn());

  /** Show sidebar only on private routes when user is signed in */
  protected readonly showSidebar = computed(() => this.isSignedIn() && this.isAuthenticatedRoute());

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: '🏠', route: '/access/v4' },
    { label: 'Alertas', icon: '🔔', route: '/alerts/v5' },
    { label: 'Mi Horario', icon: '📅', route: '/schedule/v24' },
    { label: 'Lugares', icon: '📍', route: '/campus/v7' },
    { label: 'Rutas', icon: '🗺️', route: '/campus/v25' },
    { label: 'Configuración', icon: '⚙️', route: '/settings/v26' }
  ];

  private readonly publicPrefixes = ['/access/v1', '/access/v2', '/access/v3', '/access/v33'];

  ngOnInit(): void {
    void this.registerBackButtonListener();
    this.trackRouteChanges();
    this.updateRouteAuth(this.router.url);
  }

  async ngOnDestroy(): Promise<void> {
    if (this.backButtonHandle) {
      await this.backButtonHandle.remove();
    }
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected async logout(): Promise<void> {
    const shouldLogout = await this.confirmAction(
      '¿Cerrar sesión?',
      'Tu sesión se cerrará y volverás al acceso.'
    );
    if (shouldLogout) {
      await this.authService.signOut();
      this.closeSidebar();
      await this.router.navigateByUrl('/access/v2');
    }
  }

  // ─── Private ────────────────────────────────────────────────────

  private trackRouteChanges(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.updateRouteAuth(e.urlAfterRedirects);
        this.closeSidebar();
      });
  }

  private updateRouteAuth(url: string): void {
    const isPublic = this.publicPrefixes.some((prefix) => url.startsWith(prefix)) || url === '/';
    this.isAuthenticatedRoute.set(!isPublic);
  }

  private async registerBackButtonListener(): Promise<void> {
    this.backButtonHandle = await CapacitorApp.addListener('backButton', () => {
      void this.handleBackButton();
    });
  }

  private async handleBackButton(): Promise<void> {
    const currentUrl = this.router.url;

    if (currentUrl.startsWith('/access/v4')) {
      const shouldLogout = await this.confirmAction('¿Cerrar sesión?', 'Tu sesión se cerrará y volverás al acceso.');
      if (shouldLogout) {
        await this.authService.signOut();
        await this.router.navigateByUrl('/access/v2');
      }
      return;
    }

    if (currentUrl.startsWith('/access/')) {
      const shouldExit = await this.confirmAction('¿Salir de la aplicación?', 'Estás a punto de cerrar Primiparada.');
      if (shouldExit) {
        await CapacitorApp.exitApp();
      }
      return;
    }

    this.location.back();
  }

  private async confirmAction(header: string, message: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', role: 'destructive' }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    return result.role === 'destructive';
  }
}
