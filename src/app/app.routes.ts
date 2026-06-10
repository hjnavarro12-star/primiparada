import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas — páginas completas sin layout wrapper
  { path: '', pathMatch: 'full', redirectTo: 'access/v1' },
  {
    path: 'access',
    children: [
      { path: 'v1', loadComponent: () => import('./features/access/v1-dashboard').then(m => m.V1Dashboard) },
      { path: 'v2', loadComponent: () => import('./features/access/login-page').then(m => m.LoginPage) },
      { path: 'v3', loadComponent: () => import('./features/access/register-page').then(m => m.RegisterPage) },
      { path: 'v33', loadComponent: () => import('./features/access/v33-recovery-page').then(m => m.V33RecoveryPage) },
      { path: '', redirectTo: 'v1', pathMatch: 'full' }
    ]
  },

  // Rutas privadas — envueltas en MainLayout con AuthGuard
  {
    path: 'app',
    loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/access/v4-dashboard').then(m => m.V4Dashboard) },
      { path: 'alerts', loadChildren: () => import('./features/alerts/alerts.routes').then(m => m.ALERTS_ROUTES) },
      { path: 'schedule', loadChildren: () => import('./features/schedule/schedule.routes').then(m => m.SCHEDULE_ROUTES) },
      { path: 'campus', loadChildren: () => import('./features/campus/campus.routes').then(m => m.CAMPUS_ROUTES) },
      { path: 'settings', loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Redirects de compatibilidad (rutas antiguas → nuevas)
  { path: 'access/v4', redirectTo: 'app/dashboard', pathMatch: 'full' },
  { path: 'alerts', redirectTo: 'app/alerts', pathMatch: 'full' },
  { path: 'campus', redirectTo: 'app/campus', pathMatch: 'full' },
  { path: 'schedule', redirectTo: 'app/schedule', pathMatch: 'full' },
  { path: 'settings', redirectTo: 'app/settings', pathMatch: 'full' },

  { path: '**', redirectTo: 'access/v1' }
];
