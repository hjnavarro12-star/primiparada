import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-forbidden-page',
  standalone: true,
  imports: [IonContent, IonButton, RouterLink],
  template: `
    <ion-content class="ion-padding">
      <div class="forbidden-container">
        <span class="error-icon">🚫</span>
        <h1>403</h1>
        <p class="subtitle">Acceso Denegado</p>
        <p class="description">No tienes permisos de administrador para acceder a esta seccion.</p>
        <ion-button expand="block" routerLink="/app/dashboard">
          Volver al Dashboard
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    :host { display: block; min-height: 100%; }

    ion-content {
      --background: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 30%, #a0d0c8 60%);
    }

    .forbidden-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 70vh;
      padding: 2rem 1.25rem;
    }

    .error-icon { font-size: 4rem; margin-bottom: 1rem; }
    h1 { margin: 0; font-size: 4rem; font-weight: 800; color: #c0392b; line-height: 1; }
    .subtitle { margin: 0.5rem 0 0; font-size: 1.3rem; font-weight: 700; color: #c0392b; }
    .description { margin: 0.75rem 0 2rem; color: #64748b; font-size: 0.95rem; max-width: 35ch; }

    ion-button {
      --background: #e8c843;
      --color: #1a1a2e;
      --border-radius: 12px;
      font-weight: 600;
      min-height: 48px;
      max-width: 300px;
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForbiddenPage {}
