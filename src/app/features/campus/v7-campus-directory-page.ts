import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonRow
} from '@ionic/angular/standalone';

interface PoiItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-v7-campus-directory-page',
  standalone: true,
  imports: [RouterLink, IonGrid, IonRow, IonCol, IonCard, IonCardContent],
  template: `
    <div class="directory-content">
      <div class="page-header">
        <h2>Lugares del Campus</h2>
        <p>Explora los puntos clave de la Universidad del Pacífico.</p>
      </div>

      <ion-grid>
        <ion-row>
          @for (poi of pois; track poi.route) {
            <ion-col size="6" size-md="4" size-lg="3">
              <ion-card class="poi-card" [routerLink]="poi.route">
                <ion-card-content>
                  <span class="poi-icon">{{ poi.icon }}</span>
                  <span class="poi-label">{{ poi.label }}</span>
                </ion-card-content>
              </ion-card>
            </ion-col>
          }
        </ion-row>
      </ion-grid>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
      background: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 40%, #a0d0c8 100%);
    }

    .directory-content {
      padding: 1.25rem;
    }

    .page-header {
      margin-bottom: 1.25rem;
    }

    .page-header h2 {
      margin: 0 0 0.25rem;
      font-size: 1.4rem;
      font-weight: 700;
      color: #0a709c;
    }

    .page-header p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    .poi-card {
      margin: 0;
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(10, 112, 156, 0.1);
      border: none;
      background: linear-gradient(135deg, #0a709c, #3fa779) !important;
      --background: none;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      text-decoration: none;
    }

    .poi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(10, 112, 156, 0.2);
    }

    .poi-card ion-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.25rem 0.75rem;
      text-align: center;
      --color: #ffffff;
      color: #ffffff;
    }

    .poi-icon {
      font-size: 2rem;
    }

    .poi-label {
      font-size: 0.85rem;
      font-weight: 600;
      line-height: 1.2;
      color: #ffffff;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V7CampusDirectoryPage {
  readonly pois: PoiItem[] = [
    { label: 'Baños', icon: '🚻', route: '/app/campus/v8' },
    { label: 'Biblioteca', icon: '📚', route: '/app/campus/v9' },
    { label: 'Cafetería', icon: '☕', route: '/app/campus/v10' },
    { label: 'Sendero Turístico', icon: '🌿', route: '/app/campus/v11' },
    { label: 'Gimnasio', icon: '🏋️', route: '/app/campus/v12' },
    { label: 'Bienestar', icon: '🏥', route: '/app/campus/v13' },
    { label: 'Parqueadero', icon: '🅿️', route: '/app/campus/v14' },
    { label: 'Entrada / Salida', icon: '🚪', route: '/app/campus/v15' },
    { label: 'Auditorio 1', icon: '🎭', route: '/app/campus/v16' },
    { label: 'Auditorio 2', icon: '🎭', route: '/app/campus/v17' },
    { label: 'Laboratorio 1', icon: '🔬', route: '/app/campus/v18' },
    { label: 'Laboratorio 2', icon: '🔬', route: '/app/campus/v19' },
    { label: 'Invernaderos', icon: '🌱', route: '/app/campus/v20' }
  ];
}
