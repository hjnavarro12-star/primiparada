import { Routes } from '@angular/router';

import { VIEW_SPECS } from '../../view-catalog';
import { AuthGuard } from '../../core/guards/auth.guard';

const scheduleViews = VIEW_SPECS.filter((view) => view.routePath.startsWith('schedule/'));

export const SCHEDULE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'v24'
  },
  {
    path: 'v21',
    title: 'V21 · Ingreso Manual',
    loadComponent: () => import('./v21-manual-entry-page').then((module) => module.V21ManualEntryPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v22',
    title: 'V22 · Escanear PDF',
    loadComponent: () => import('./v22-pdf-scan-page').then((module) => module.V22PdfScanPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v23',
    title: 'V23 · Escanear Imagen',
    loadComponent: () => import('./v23-image-scan-page').then((module) => module.V23ImageScanPage),
    canActivate: [AuthGuard]
  },
  ...scheduleViews.map((view) => ({
    path: view.path,
    title: `${view.code} · ${view.title}`,
    loadComponent: () => import('../../view-page').then((module) => module.ViewPage),
    data: { view }
  })).filter((route) => route.path !== 'v21' && route.path !== 'v22' && route.path !== 'v23' && route.path !== 'v24'),
  {
    path: 'v24',
    title: 'V24 · Gestor de Horario',
    loadComponent: () => import('./v24-schedule-manager').then((module) => module.V24ScheduleManager),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'v24'
  }
];
