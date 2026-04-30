import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'access/v1'
	},
	{
		path: 'access',
		loadChildren: () => import('./features/access/access.routes').then((module) => module.ACCESS_ROUTES)
	},
	{
		path: 'alerts',
		loadChildren: () => import('./features/alerts/alerts.routes').then((module) => module.ALERTS_ROUTES)
	},
	{
		path: 'campus',
		loadChildren: () => import('./features/campus/campus.routes').then((module) => module.CAMPUS_ROUTES)
	},
	{
		path: 'schedule',
		loadChildren: () => import('./features/schedule/schedule.routes').then((module) => module.SCHEDULE_ROUTES)
	},
	{
		path: 'settings',
		loadChildren: () => import('./features/settings/settings.routes').then((module) => module.SETTINGS_ROUTES)
	},
	{
		path: '**',
		redirectTo: 'access/v1'
	}
];
