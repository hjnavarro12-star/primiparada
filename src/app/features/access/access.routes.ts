import { Routes } from '@angular/router';

import { VIEW_SPECS } from '../../view-catalog';
import { ExitGuard } from '../../core/guards/exit.guard';
import { AuthGuard } from '../../core/guards/auth.guard';

const accessViews = VIEW_SPECS.filter((view) => view.routePath.startsWith('access/'));

export const ACCESS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'v1'
  },
  {
    path: 'v1',
    title: 'V1 · Dashboard Público',
    loadComponent: () => import('./v1-dashboard').then((m) => m.V1Dashboard),
    canDeactivate: [ExitGuard]
  },
  {
    path: 'v2',
    title: 'V2 · Iniciar Sesión',
    loadComponent: () => import('./login-page').then((module) => module.LoginPage),
    canDeactivate: [ExitGuard]
  },
  {
    path: 'v3',
    title: 'V3 · Registro',
    loadComponent: () => import('./register-page').then((module) => module.RegisterPage),
    canDeactivate: [ExitGuard]
  },
  {
    path: 'v4',
    title: 'V4 · Dashboard Privado',
    loadComponent: () => import('./v4-dashboard').then((module) => module.V4Dashboard),
    canDeactivate: [ExitGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'v33',
    title: 'V33 · Recuperar Contraseña',
    loadComponent: () => import('./v33-recovery-page').then((module) => module.V33RecoveryPage),
    canDeactivate: [ExitGuard]
  },
  ...accessViews.map((view) => ({
    path: view.path,
    title: `${view.code} · ${view.title}`,
    loadComponent: () => import('../../view-page').then((module) => module.ViewPage),
    data: { view }
  })).filter((route) => route.path !== 'v1' && route.path !== 'v2' && route.path !== 'v3' && route.path !== 'v4' && route.path !== 'v33'),
  {
    path: '**',
    redirectTo: 'v1'
  }
];
