import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonNote,
    IonSpinner,
    IonText
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/access/v1"></ion-back-button>
        </ion-buttons>
        <ion-title>Iniciar sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="auth-container">
        <div class="auth-header">
          <h1>Bienvenido de vuelta</h1>
          <p>Ingresa con tu correo institucional para acceder a tu dashboard.</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="submit()">
          <ion-list lines="none" class="auth-form-list">
            <ion-item>
              <ion-input
                type="email"
                formControlName="email"
                label="Correo institucional"
                labelPlacement="floating"
                placeholder="nombre@correo.com"
                autocomplete="email"
              ></ion-input>
            </ion-item>
            @if (loginForm.controls.email.touched && loginForm.controls.email.invalid) {
              <ion-note color="danger" class="field-note">Ingresa un correo válido.</ion-note>
            }

            <ion-item>
              <ion-input
                type="password"
                formControlName="password"
                label="Contraseña"
                labelPlacement="floating"
                placeholder="Tu contraseña"
                autocomplete="current-password"
              ></ion-input>
            </ion-item>
            @if (loginForm.controls.password.touched && loginForm.controls.password.invalid) {
              <ion-note color="danger" class="field-note">La contraseña es obligatoria.</ion-note>
            }
          </ion-list>

          <div class="auth-actions">
            <ion-button expand="block" type="submit" [disabled]="loadingSubmit() || loadingSession()">
              @if (loadingSubmit()) {
                <ion-spinner name="crescent" slot="start"></ion-spinner>
              }
              {{ loadingSubmit() ? 'Ingresando...' : 'Entrar' }}
            </ion-button>

            <ion-button expand="block" fill="clear" routerLink="/access/v33" size="small">
              ¿Olvidó su contraseña?
            </ion-button>

            <ion-button expand="block" fill="clear" routerLink="/access/v3" size="small">
              ¿No tienes cuenta? Regístrate
            </ion-button>
          </div>
        </form>

        @if (errorMessage()) {
          <ion-text color="danger">
            <p class="error-message">{{ errorMessage() }}</p>
          </ion-text>
        }
      </div>
    </ion-content>
  `,
  styles: [`
    .auth-container {
      max-width: 480px;
      margin: 0 auto;
      padding: 2rem 0;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    .auth-header p {
      margin: 0;
      opacity: 0.8;
      line-height: 1.5;
    }

    .auth-form-list {
      background: transparent;
      margin-bottom: 1.5rem;
    }

    .auth-form-list ion-item {
      --background: var(--ion-card-background);
      --border-radius: 12px;
      margin-bottom: 0.75rem;
    }

    .field-note {
      display: block;
      padding: 0 1rem 0.5rem;
      font-size: 0.8rem;
    }

    .auth-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .error-message {
      text-align: center;
      margin-top: 1rem;
    }

    @media (min-width: 768px) {
      .auth-container {
        padding-top: 4rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loadingSession = signal(true);
  protected readonly loadingSubmit = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  async ngOnInit(): Promise<void> {
    try {
      const session = await this.authService.initializeSession();
      if (session) {
        await this.router.navigate(['/access/v4']);
        return;
      }
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo verificar la sesión.');
    } finally {
      this.loadingSession.set(false);
    }
  }

  protected async submit(): Promise<void> {
    this.errorMessage.set('');
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loadingSubmit.set(true);
    try {
      const { email, password } = this.loginForm.getRawValue();
      await this.authService.login({ email, password });
      await this.router.navigate(['/access/v4']);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    } finally {
      this.loadingSubmit.set(false);
    }
  }
}
