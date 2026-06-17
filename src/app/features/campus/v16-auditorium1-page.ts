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

@Component({
  selector: 'app-v16-auditorium1-page',
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
        <h2>🎭 Auditorio 1</h2>
        <p>Espacio para eventos académicos, conferencias y presentaciones.</p>
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
                  <p>El mapa te guiará al Auditorio 1 desde tu ubicación actual.</p>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Información descriptiva -->
          <ion-col size="12" size-lg="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Información general</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list lines="none" class="info-list">
                  <ion-item>
                    <ion-label>
                      <h3>Ubicación</h3>
                      <!-- TODO: Añadir ubicación exacta -->
                      <p>—</p>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label>
                      <h3>Capacidad</h3>
                      <!-- TODO: Añadir número de personas -->
                      <p>—</p>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label>
                      <h3>Equipamiento</h3>
                      <!-- TODO: Proyector, sonido, micrófono, etc. -->
                      <p>—</p>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label>
                      <h3>Reservas</h3>
                      <!-- TODO: Cómo reservar, contacto -->
                      <p>—</p>
                    </ion-label>
                  </ion-item>
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
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.95rem;
    }

    .info-list {
      --ion-item-background: transparent;
    }

    .info-list ion-item {
      --background: rgba(255, 255, 255, 0.08);
      --color: #ffffff;
      --min-height: 44px;
      border-radius: 8px;
      margin-bottom: 4px;
    }

    .info-list ion-label h3 {
      color: #e8c843;
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .info-list ion-label p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
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
export class V16Auditorium1Page {}
