import { Routes } from '@angular/router';

import { VIEW_SPECS } from '../../view-catalog';
import { AuthGuard } from '../../core/guards/auth.guard';

const settingsViews = VIEW_SPECS.filter((view) => view.routePath.startsWith('settings/'));

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'v26'
  },
  {
    path: 'v26',
    title: 'V26 · Configuraciones Generales',
    loadComponent: () => import('./v26-settings-hub-page').then((module) => module.V26SettingsHubPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v27',
    title: 'V27 · Tamaño de Letra',
    loadComponent: () => import('./v27-font-size-page').then((module) => module.V27FontSizePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v28',
    title: 'V28 · Sonido de Alarma',
    loadComponent: () => import('./v28-alarm-sound-page').then((module) => module.V28AlarmSoundPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v29',
    title: 'V29 · Notificaciones',
    loadComponent: () => import('./v29-notifications-page').then((module) => module.V29NotificationsPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v30',
    title: 'V30 · Color de la App',
    loadComponent: () => import('./v30-color-page').then((module) => module.V30ColorPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v31',
    title: 'V31 · Licencias Open Source',
    loadComponent: () => import('./v31-licenses-page').then((module) => module.V31LicensesPage),
    canActivate: [AuthGuard]
  },
  ...settingsViews.map((view) => ({
    path: view.path,
    title: `${view.code} · ${view.title}`,
    loadComponent: () => import('../../view-page').then((module) => module.ViewPage),
    data: { view }
  })).filter((route) => route.path !== 'v26' && route.path !== 'v27' && route.path !== 'v28' && route.path !== 'v29' && route.path !== 'v30' && route.path !== 'v31'),
  {
    path: '**',
    redirectTo: 'v26'
  }
];
