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
  IonRow
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-v25-navigation-page',
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
    IonRow
  ],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h2>🧭 Navegación en Tiempo Real</h2>
        <p>Encuentra tu destino dentro del campus con asistencia GPS y rutas guiadas.</p>
      </div>

      <ion-grid>
        <ion-row>
          <!-- Mapa full-screen placeholder -->
          <ion-col size="12">
            <ion-card class="map-card">
              <ion-card-header>
                <ion-card-title>Mapa del campus</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <div class="map-placeholder">
                  <span class="map-icon">🗺️</span>
                  <p class="main-text">Navegación GPS en desarrollo</p>
                  <p class="sub-text">Aquí se mostrará el mapa interactivo con tu ubicación en tiempo real, línea de ruta azul y asistencia por voz para llegar a tu destino.</p>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Funcionalidades previstas</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <div class="features-list">
                  <div class="feature-item">
                    <span class="feature-icon">📍</span>
                    <div class="feature-info">
                      <strong>Ubicación GPS en tiempo real</strong>
                      <p>Punto móvil que sigue tu posición dentro del campus.</p>
                    </div>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🔵</span>
                    <div class="feature-info">
                      <strong>Ruta azul animada</strong>
                      <p>Línea azul brillante que indica el camino hasta tu destino.</p>
                    </div>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🔊</span>
                    <div class="feature-info">
                      <strong>Instrucciones por voz</strong>
                      <p>TTS en español: "Gire a la izquierda", "Ha llegado a su destino".</p>
                    </div>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🧭</span>
                    <div class="feature-info">
                      <strong>Brújula integrada</strong>
                      <p>El mapa se orienta según tu dirección de movimiento.</p>
                    </div>
                  </div>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div class="future-note">
        <p>🚧 La navegación completa con GPS, Mapbox y TTS se implementará en el Sprint 5. Por ahora esta vista muestra la estructura planificada.</p>
      </div>

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
      min-height: 250px;
      text-align: center;
      padding: 2rem 1.5rem;
    }

    .map-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .main-text {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: #ffffff;
    }

    .sub-text {
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      max-width: 45ch;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 10px;
    }

    .feature-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .feature-info strong {
      display: block;
      color: #ffffff;
      font-size: 0.9rem;
    }

    .feature-info p {
      margin: 0.2rem 0 0;
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.8rem;
    }

    .future-note {
      margin: 1rem 0;
      padding: 1rem;
      background: rgba(232, 200, 67, 0.15);
      border: 1px solid rgba(232, 200, 67, 0.3);
      border-radius: 12px;
    }

    .future-note p {
      margin: 0;
      color: #64748b;
      font-size: 0.85rem;
      line-height: 1.5;
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
export class V25NavigationPage {}
