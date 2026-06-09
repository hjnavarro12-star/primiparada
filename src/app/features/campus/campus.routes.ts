import { Routes } from '@angular/router';

import { VIEW_SPECS } from '../../view-catalog';
import { AuthGuard } from '../../core/guards/auth.guard';

const campusViews = VIEW_SPECS.filter((view) => view.routePath.startsWith('campus/'));

export const CAMPUS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'v7'
  },
  {
    path: 'v7',
    title: 'V7 · Directorio de Lugares',
    loadComponent: () => import('./v7-campus-directory-page').then((module) => module.V7CampusDirectoryPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v8',
    title: 'V8 · Baños',
    loadComponent: () => import('./v8-bathrooms-page').then((module) => module.V8BathroomsPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v9',
    title: 'V9 · Biblioteca',
    loadComponent: () => import('./v9-library-page').then((module) => module.V9LibraryPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v10',
    title: 'V10 · Cafetería / Restaurante',
    loadComponent: () => import('./v10-cafeteria-page').then((module) => module.V10CafeteriaPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v11',
    title: 'V11 · Sendero Turístico',
    loadComponent: () => import('./v11-trail-page').then((module) => module.V11TrailPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'v12',
    title: 'V12 · Gimnasio',
    loadComponent: () => import('./v12-gym-page').then((module) => module.V12GymPage),
    canActivate: [AuthGuard]
  },
  ...campusViews.map((view) => ({
    path: view.path,
    title: `${view.code} · ${view.title}`,
    loadComponent: () => import('../../view-page').then((module) => module.ViewPage),
    data: { view },
    canActivate: [AuthGuard]
  })).filter((route) => route.path !== 'v7' && route.path !== 'v8' && route.path !== 'v9' && route.path !== 'v10' && route.path !== 'v11' && route.path !== 'v12'),
  {
    path: '**',
    redirectTo: 'v7'
  }
];
