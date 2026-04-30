import { Routes } from '@angular/router';

import { VIEW_SPECS } from '../../view-catalog';

const accessViews = VIEW_SPECS.filter((view) => view.routePath.startsWith('access/'));

export const ACCESS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'v1'
  },
  {
    path: 'v2',
    title: 'V2 · Iniciar Sesión',
    loadComponent: () => import('./login-page').then((module) => module.LoginPage)
  },
  {
    path: 'v3',
    title: 'V3 · Registro',
    loadComponent: () => import('./register-page').then((module) => module.RegisterPage)
  },
  ...accessViews.map((view) => ({
    path: view.path,
    title: `${view.code} · ${view.title}`,
    loadComponent: () => import('../../view-page').then((module) => module.ViewPage),
    data: { view }
  })).filter((route) => route.path !== 'v2' && route.path !== 'v3'),
  {
    path: '**',
    redirectTo: 'v1'
  }
];
