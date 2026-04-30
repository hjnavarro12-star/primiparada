import { Routes } from '@angular/router';

import { VIEW_SPECS } from '../../view-catalog';

const settingsViews = VIEW_SPECS.filter((view) => view.routePath.startsWith('settings/'));

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'v26'
  },
  ...settingsViews.map((view) => ({
    path: view.path,
    title: `${view.code} · ${view.title}`,
    loadComponent: () => import('../../view-page').then((module) => module.ViewPage),
    data: { view }
  })),
  {
    path: '**',
    redirectTo: 'v26'
  }
];
