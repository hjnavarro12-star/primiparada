import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { VIEW_GROUPS, VIEW_SPECS } from './view-catalog';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly totalViews = VIEW_SPECS.length;
  protected readonly navigationGroups = VIEW_GROUPS;
  protected readonly sprintHighlights = [
    'Angular 21 standalone en shell limpio',
    'Rutas V1-V31 lazy-load listadas',
    'Base lista para Supabase y fases siguientes'
  ];
}
