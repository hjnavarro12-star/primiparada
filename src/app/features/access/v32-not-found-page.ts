import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent
} from '@ionic/angular/standalone';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-v32-not-found-page',
  standalone: true,
  imports: [IonContent, IonButton],
  template: `
    <ion-content class="ion-padding">
      <div class="not-found-container">
        <span class="error-icon">🚧</span>
        <h1>404</h1>
        <p class="subtitle">Página no encontrada</p>
        <p class="description">La ruta que buscas no existe o fue movida. Puedes volver al inicio.</p>

        <ion-button expand="block" (click)="goHome()">
          Volver al inicio
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
    }

    ion-content {
      --background: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 30%, #a0d0c8 60%);
    }

    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 70vh;
      padding: 2rem 1.25rem;
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    h1 {
      margin: 0;
      font-size: 4rem;
      font-weight: 800;
      color: #0a709c;
      line-height: 1;
    }

    .subtitle {
      margin: 0.5rem 0 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0a709c;
    }

    .description {
      margin: 0.75rem 0 2rem;
      color: #64748b;
      font-size: 0.95rem;
      max-width: 35ch;
    }

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
export class V32NotFoundPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    await this.authService.initializeSession();
  }

  protected goHome(): void {
    const user = this.authService.userSnapshot;
    if (user) {
      this.router.navigate(['/app/dashboard']);
    } else {
      this.router.navigate(['/access/v1']);
    }
  }
}
