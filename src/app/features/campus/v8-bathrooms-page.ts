import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonRow
} from '@ionic/angular/standalone';

interface Bathroom {
  name: string;
  location: string;
  floor: string;
  gender: string;
}

@Component({
  selector: 'app-v8-bathrooms-page',
  standalone: true,
  imports: [
    RouterLink,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonItem,
    IonLabel,
    IonList,
    IonRow
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>🚻 Baños</h2>
        <p>14 baños disponibles en el campus. El mapa te guiará al más cercano.</p>
      </div>

      <ion-grid>
        <ion-row>
          <!-- Mapa placeholder -->
          <ion-col size="12" size-lg="6">
            <ion-card class="map-card">
              <ion-card-header>
                <ion-card-title>Mapa de ubicación</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <div class="map-placeholder">
                  <span class="map-icon">🗺️</span>
                  <p>El mapa te guiará al baño más cercano desde tu ubicación actual.</p>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Lista descriptiva -->
          <ion-col size="12" size-lg="6">
            <ion-card class="list-card">
              <ion-card-header>
                <ion-card-title>Ubicaciones (14 baños)</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <h3 class="section-title">Hilera 1 — Bloque principal</h3>
                <ion-list lines="none" class="bathroom-list">
                  @for (item of hilera1; track item.name) {
                    <ion-item>
                      <ion-label>
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.location }} · {{ item.floor }} · {{ item.gender }}</p>
                      </ion-label>
                    </ion-item>
                  }
                </ion-list>

                <h3 class="section-title">Hilera 2 — Bloque académico</h3>
                <ion-list lines="none" class="bathroom-list">
                  @for (item of hilera2; track item.name) {
                    <ion-item>
                      <ion-label>
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.location }} · {{ item.floor }} · {{ item.gender }}</p>
                      </ion-label>
                    </ion-item>
                  }
                </ion-list>

                <h3 class="section-title">Bienestar / Gimnasio</h3>
                <ion-list lines="none" class="bathroom-list">
                  @for (item of bienestar; track item.name) {
                    <ion-item>
                      <ion-label>
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.location }} · {{ item.floor }} · {{ item.gender }}</p>
                      </ion-label>
                    </ion-item>
                  }
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div class="actions">
        <ion-button expand="block" routerLink="/app/campus/v7">
          Volver al directorio
        </ion-button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
      background-color: #a0d0c8;
      background-image: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 30%, #a0d0c8 60%);
      background-size: 100% 100vh;
      background-repeat: no-repeat;
    }

    .page-content {
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

    ion-card {
      margin: 0 0 1rem;
      border-radius: 14px;
      box-shadow: 0 4px 16px rgba(10, 112, 156, 0.1);
      border: none;
      background: linear-gradient(135deg, #0a709c, #3fa779) !important;
      --background: none;
      --color: #ffffff;
      color: #ffffff;
    }

    ion-card-header {
      --background: transparent;
    }

    ion-card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #ffffff;
    }

    ion-card-content {
      --color: #ffffff;
      color: #ffffff;
    }

    .map-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      text-align: center;
      padding: 1.5rem;
    }

    .map-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .map-placeholder p {
      margin: 0 0 0.5rem;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
    }

    .map-hint {
      font-style: italic;
      opacity: 0.7;
    }

    .section-title {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 1rem 0 0.5rem;
      color: #e8c843;
    }

    .section-title:first-of-type {
      margin-top: 0;
    }

    .bathroom-list {
      --ion-item-background: transparent;
    }

    .bathroom-list ion-item {
      --background: rgba(255, 255, 255, 0.08);
      --color: #ffffff;
      --min-height: 40px;
      border-radius: 8px;
      margin-bottom: 4px;
    }

    .bathroom-list ion-label h3 {
      color: #ffffff;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .bathroom-list ion-label p {
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.8rem;
    }

    .actions {
      margin-top: 1rem;
    }

    .actions ion-button {
      --background: #e8c843;
      --color: #1a1a2e;
      --border-radius: 12px;
      font-weight: 600;
      min-height: 48px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V8BathroomsPage {
  readonly hilera1: Bathroom[] = [
    { name: 'Baño 1', location: 'Hilera 1', floor: 'Piso 1', gender: 'Hombres' },
    { name: 'Baño 2', location: 'Hilera 1', floor: 'Piso 1', gender: 'Mujeres' },
    { name: 'Baño 3', location: 'Hilera 1', floor: 'Piso 2', gender: 'Hombres' },
    { name: 'Baño 4', location: 'Hilera 1', floor: 'Piso 2', gender: 'Mujeres' },
    { name: 'Baño 5', location: 'Hilera 1', floor: 'Piso 3', gender: 'Hombres' },
    { name: 'Baño 6', location: 'Hilera 1', floor: 'Piso 3', gender: 'Mujeres' },
  ];

  readonly hilera2: Bathroom[] = [
    { name: 'Baño 7', location: 'Hilera 2', floor: 'Piso 1', gender: 'Hombres' },
    { name: 'Baño 8', location: 'Hilera 2', floor: 'Piso 1', gender: 'Mujeres' },
    { name: 'Baño 9', location: 'Hilera 2', floor: 'Piso 2', gender: 'Hombres' },
    { name: 'Baño 10', location: 'Hilera 2', floor: 'Piso 2', gender: 'Mujeres' },
    { name: 'Baño 11', location: 'Hilera 2', floor: 'Piso 3', gender: 'Hombres' },
    { name: 'Baño 12', location: 'Hilera 2', floor: 'Piso 3', gender: 'Mujeres' },
  ];

  readonly bienestar: Bathroom[] = [
    { name: 'Baño 13', location: 'Bienestar / Gym', floor: 'Piso 1', gender: 'Hombres' },
    { name: 'Baño 14', location: 'Bienestar / Gym', floor: 'Piso 1', gender: 'Mujeres' },
  ];
}
