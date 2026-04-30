import { Routes } from '@angular/router';

import { VIEW_SPECS } from '../../view-catalog';

const scheduleViews = VIEW_SPECS.filter((view) => view.routePath.startsWith('schedule/'));

export const SCHEDULE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'v21'
  },
  ...scheduleViews.map((view) => ({
    path: view.path,
    title: `${view.code} · ${view.title}`,
    loadComponent: () => import('../../view-page').then((module) => module.ViewPage),
    data: { view }
  })),
  {
    path: '**',
    redirectTo: 'v21'
  }
];
