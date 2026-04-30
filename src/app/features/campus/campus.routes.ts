import { Routes } from '@angular/router';

import { VIEW_SPECS } from '../../view-catalog';

const campusViews = VIEW_SPECS.filter((view) => view.routePath.startsWith('campus/'));

export const CAMPUS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'v7'
  },
  ...campusViews.map((view) => ({
    path: view.path,
    title: `${view.code} · ${view.title}`,
    loadComponent: () => import('../../view-page').then((module) => module.ViewPage),
    data: { view }
  })),
  {
    path: '**',
    redirectTo: 'v7'
  }
];
