import { Routes } from '@angular/router';

import { VIEW_SPECS } from '../../view-catalog';

const alertViews = VIEW_SPECS.filter((view) => view.routePath.startsWith('alerts/'));

export const ALERTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'v5'
  },
  {
    path: 'v5',
    title: 'V5 · Alertas',
    loadComponent: () => import('./v5-alerts-page').then((m) => m.V5AlertsPage)
  },
  {
    path: 'v6',
    title: 'V6 · Configuración de Alertas',
    loadComponent: () => import('./v6-alert-config-page').then((m) => m.V6AlertConfigPage)
  },
  ...alertViews.map((view) => ({
    path: view.path,
    title: `${view.code} · ${view.title}`,
    loadComponent: () => import('../../view-page').then((module) => module.ViewPage),
    data: { view }
  })).filter((route) => route.path !== 'v5' && route.path !== 'v6'),
  {
    path: '**',
    redirectTo: 'v5'
  }
];
