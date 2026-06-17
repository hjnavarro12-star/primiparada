import { Routes } from '@angular/router';

import { VIEW_SPECS } from '../../view-catalog';

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
    loadComponent: () => import('./v7-campus-directory-page').then((module) => module.V7CampusDirectoryPage)
  },
  {
    path: 'v8',
    title: 'V8 · Baños',
    loadComponent: () => import('./v8-bathrooms-page').then((module) => module.V8BathroomsPage)
  },
  {
    path: 'v9',
    title: 'V9 · Biblioteca',
    loadComponent: () => import('./v9-library-page').then((module) => module.V9LibraryPage)
  },
  {
    path: 'v10',
    title: 'V10 · Cafetería / Restaurante',
    loadComponent: () => import('./v10-cafeteria-page').then((module) => module.V10CafeteriaPage)
  },
  {
    path: 'v11',
    title: 'V11 · Sendero Turístico',
    loadComponent: () => import('./v11-trail-page').then((module) => module.V11TrailPage)
  },
  {
    path: 'v12',
    title: 'V12 · Gimnasio',
    loadComponent: () => import('./v12-gym-page').then((module) => module.V12GymPage)
  },
  {
    path: 'v13',
    title: 'V13 · Bienestar Universitario',
    loadComponent: () => import('./v13-welfare-page').then((module) => module.V13WelfarePage)
  },
  {
    path: 'v14',
    title: 'V14 · Parqueadero',
    loadComponent: () => import('./v14-parking-page').then((module) => module.V14ParkingPage)
  },
  {
    path: 'v15',
    title: 'V15 · Entrada / Salida',
    loadComponent: () => import('./v15-entrance-page').then((module) => module.V15EntrancePage)
  },
  {
    path: 'v16',
    title: 'V16 · Auditorio 1',
    loadComponent: () => import('./v16-auditorium1-page').then((module) => module.V16Auditorium1Page)
  },
  {
    path: 'v17',
    title: 'V17 · Auditorio 2',
    loadComponent: () => import('./v17-auditorium2-page').then((module) => module.V17Auditorium2Page)
  },
  {
    path: 'v18',
    title: 'V18 · Laboratorio 1',
    loadComponent: () => import('./v18-lab1-page').then((module) => module.V18Lab1Page)
  },
  {
    path: 'v19',
    title: 'V19 · Laboratorio 2',
    loadComponent: () => import('./v19-lab2-page').then((module) => module.V19Lab2Page)
  },
  {
    path: 'v20',
    title: 'V20 · Invernaderos',
    loadComponent: () => import('./v20-greenhouse-page').then((module) => module.V20GreenhousePage)
  },
  {
    path: 'v25',
    title: 'V25 · Navegación en Tiempo Real',
    loadComponent: () => import('./v25-navigation-page').then((module) => module.V25NavigationPage)
  },
  ...campusViews.map((view) => ({
    path: view.path,
    title: `${view.code} · ${view.title}`,
    loadComponent: () => import('../../view-page').then((module) => module.ViewPage),
    data: { view }
  })).filter((route) => route.path !== 'v7' && route.path !== 'v8' && route.path !== 'v9' && route.path !== 'v10' && route.path !== 'v11' && route.path !== 'v12' && route.path !== 'v13' && route.path !== 'v14' && route.path !== 'v15' && route.path !== 'v16' && route.path !== 'v17' && route.path !== 'v18' && route.path !== 'v19' && route.path !== 'v20' && route.path !== 'v25'),
  {
    path: '**',
    redirectTo: 'v7'
  }
];
