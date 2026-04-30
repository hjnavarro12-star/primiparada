import { Routes } from '@angular/router';

import { VIEW_SPECS } from '../../view-catalog';

const alertViews = VIEW_SPECS.filter((view) => view.routePath.startsWith('alerts/'));

export const ALERTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'v5'
  },
  ...alertViews.map((view) => ({
    path: view.path,
    title: `${view.code} · ${view.title}`,
    loadComponent: () => import('../../view-page').then((module) => module.ViewPage),
    data: { view }
  })),
  {
    path: '**',
    redirectTo: 'v5'
  }
];
