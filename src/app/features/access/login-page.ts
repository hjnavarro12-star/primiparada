import {
  ChangeDetectionStrategy, Component, OnInit,
  inject, signal, computed
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton, IonContent, IonInput, IonItem,
  IonList, IonNote, IonSpinner, IonText, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';

import { AuthService }       from '../../core/services/auth.service';
import { ApiService }        from '../../core/services/api.service';
import { ProgramsService }   from '../../core/services/programs.service';
import { RegistrationService } from '../../core/services/registration.service';
import { allowedEmailDomainValidator } from '../../shared/utils/email-domain.validator';
import { strongPasswordValidator }     from '../../shared/utils/strong-password.validator';
import type { Program } from '../../shared/models/program.model';

type AuthStep = 'email' | 'login' | 'register' | 'recover';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    IonContent, IonList, IonItem, IonInput, IonButton,
    IonNote, IonSpinner, IonText, IonSelect, IonSelectOption
  ],
  template: `
    <ion-content class="ion-padding">
      <div class="auth-container">

        <!-- Cabecera dinámica -->
        <button class="back-btn" (click)="goBack()" [class.hidden]="step() === 'email'">
          ← Volver
        </button>
        <a class="back-btn" routerLink="/access/v1" [class.hidden]="step() !== 'email'">
          ← Inicio
        </a>

        <div class="auth-header">
          <div class="auth-logo">P</div>

          @switch (step()) {
            @case ('email') {
              <h1>Bienvenido</h1>
              <p>Ingresa tu correo para continuar</p>
            }
            @case ('login') {
              <h1>Hola de nuevo</h1>
              <p class="email-chip">{{ emailCtrl.value }}</p>
            }
            @case ('register') {
              <h1>Crear cuenta</h1>
              <p class="email-chip">{{ emailCtrl.value }}</p>
            }
            @case ('recover') {
              <h1>Recuperar acceso</h1>
              <p>Te enviaremos un enlace a tu correo</p>
            }
          }
        </div>

        <!-- PASO 1: Correo -->
        @if (step() === 'email') {
          <form (ngSubmit)="checkEmail()">
            <ion-list lines="none" class="auth-form-list">
              <ion-item>
                <ion-input
                  type="email"
                  [formControl]="emailCtrl"
                  label="Correo"
                  labelPlacement="floating"
                  placeholder="nombre@correo.com"
                  autocomplete="email"
                  (keyup.enter)="checkEmail()"
                ></ion-input>
              </ion-item>
              @if (emailCtrl.touched && emailCtrl.invalid) {
                @if (emailCtrl.errors?.['invalidDomain']) {
                  <ion-note color="danger" class="field-note">
                    {{ emailCtrl.errors!['invalidDomain']?.['message'] ?? 'Dominio no permitido. Usa correo institucional (.edu.co) o un proveedor conocido.' }}
                  </ion-note>
                } @else {
                  <ion-note color="danger" class="field-note">Ingresa un correo válido.</ion-note>
                }
              }
            </ion-list>
            <ion-button expand="block" type="submit" [disabled]="loading()">
              @if (loading()) { <ion-spinner name="crescent" slot="start"></ion-spinner> }
              {{ loading() ? 'Verificando...' : 'Continuar' }}
            </ion-button>
          </form>
        }

        <!-- PASO 2a: Login (correo existe) -->
        @if (step() === 'login') {
          <form [formGroup]="loginForm" (ngSubmit)="submitLogin()">
            <ion-list lines="none" class="auth-form-list">
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
            <ion-button expand="block" type="submit" [disabled]="loading()">
              @if (loading()) { <ion-spinner name="crescent" slot="start"></ion-spinner> }
              {{ loading() ? 'Entrando...' : 'Entrar' }}
            </ion-button>
            <ion-button expand="block" fill="clear" size="small" (click)="goToRecover()">
              ¿Olvidaste tu contraseña?
            </ion-button>
          </form>
        }

        <!-- PASO 2b: Registro (correo no existe) -->
        @if (step() === 'register') {
          <form [formGroup]="registerForm" (ngSubmit)="submitRegister()">
            <ion-list lines="none" class="auth-form-list">
              <ion-item>
                <ion-input
                  type="password"
                  formControlName="password"
                  label="Crea una contraseña"
                  labelPlacement="floating"
                  placeholder="Mínimo 8 caracteres"
                  autocomplete="new-password"
                ></ion-input>
              </ion-item>
              @if (registerForm.controls.password.touched && registerForm.controls.password.invalid) {
                @if (registerForm.controls.password.errors?.['weakPassword']) {
                  <ion-note color="danger" class="field-note">
                    Requisitos: {{ registerForm.controls.password.errors!['weakPassword'].requirements.join(', ') }}
                  </ion-note>
                } @else {
                  <ion-note color="danger" class="field-note">La contraseña es obligatoria.</ion-note>
                }
              }

              <ion-item>
                <ion-select
                  formControlName="programId"
                  label="Programa académico"
                  labelPlacement="floating"
                  placeholder="Selecciona tu programa"
                  [disabled]="loadingPrograms()"
                >
                  @for (p of programs(); track p.id) {
                    <ion-select-option [value]="p.id">{{ p.code }} · {{ p.name }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>
              @if (registerForm.controls.programId.touched && registerForm.controls.programId.invalid) {
                <ion-note color="danger" class="field-note">Selecciona tu programa.</ion-note>
              }
            </ion-list>
            <ion-button expand="block" type="submit" class="btn-register" [disabled]="loading() || loadingPrograms()">
              @if (loading()) { <ion-spinner name="crescent" slot="start"></ion-spinner> }
              {{ loading() ? 'Creando cuenta...' : 'Crear cuenta' }}
            </ion-button>
          </form>
        }

        <!-- PASO recuperación -->
        @if (step() === 'recover') {
          <form (ngSubmit)="submitRecover()">
            <ion-list lines="none" class="auth-form-list">
              <ion-item>
                <ion-input
                  type="email"
                  [formControl]="emailCtrl"
                  label="Correo"
                  labelPlacement="floating"
                  autocomplete="email"
                ></ion-input>
              </ion-item>
            </ion-list>
            <ion-button expand="block" type="submit" [disabled]="loading()">
              @if (loading()) { <ion-spinner name="crescent" slot="start"></ion-spinner> }
              {{ loading() ? 'Enviando...' : 'Enviar enlace' }}
            </ion-button>
          </form>
        }

        <!-- Mensajes de feedback -->
        @if (errorMsg()) {
          <ion-text color="danger">
            <p class="status-msg">{{ errorMsg() }}</p>
          </ion-text>
        }
        @if (successMsg()) {
          <ion-text color="success">
            <p class="status-msg">{{ successMsg() }}</p>
          </ion-text>
        }

      </div>
    </ion-content>
  `,
  styles: [`
    ion-content {
      --background: linear-gradient(170deg, #f4f8fb 0%, #e8f5e9 30%, #a0d0c8 60%);
    }

    .auth-container {
      max-width: 420px;
      margin: 0 auto;
      padding: 1.5rem 1rem 2rem;
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }

    .back-btn {
      background: none;
      border: none;
      color: #0a709c;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      padding: 0;
      text-decoration: none;
      margin-bottom: 1.5rem;
      display: inline-block;
      min-height: 44px;
      line-height: 44px;

      &.hidden { visibility: hidden; }
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-logo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0a709c, #3fa779);
      color: #fff;
      font-size: 1.8rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      box-shadow: 0 4px 16px rgba(10, 112, 156, 0.25);
    }

    .auth-header h1 {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0 0 0.4rem;
      color: #0a709c;
    }

    .auth-header p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    .email-chip {
      display: inline-block;
      background: rgba(10, 112, 156, 0.1);
      border: 1px solid rgba(10, 112, 156, 0.2);
      border-radius: 999px;
      padding: 0.3rem 0.9rem;
      color: #0a709c;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .auth-form-list {
      background: transparent;
      margin-bottom: 1rem;
    }

    .auth-form-list ion-item {
      --background: rgba(255, 255, 255, 0.88);
      --border-radius: 12px;
      margin-bottom: 0.6rem;
      --border-color: rgba(10, 112, 156, 0.15);
      box-shadow: 0 2px 8px rgba(10, 112, 156, 0.06);
    }

    .field-note {
      display: block;
      padding: 0 1rem 0.5rem;
      font-size: 0.78rem;
    }

    ion-button[expand="block"]:not([fill="clear"]) {
      --background: #0a709c;
      --color: #ffffff;
      --border-radius: 12px;
      font-weight: 700;
      min-height: 50px;
      margin-bottom: 0.5rem;
    }

    .btn-register {
      --background: #39b552 !important;
    }

    ion-button[fill="clear"] {
      --color: #0a709c;
      font-size: 0.88rem;
    }

    .status-msg {
      text-align: center;
      margin-top: 1rem;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      font-weight: 500;
      font-size: 0.9rem;
      background: rgba(255, 255, 255, 0.85);
    }

    @media (min-width: 768px) {
      .auth-container { padding-top: 4rem; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage implements OnInit {
  private readonly fb            = inject(FormBuilder);
  private readonly authService   = inject(AuthService);
  private readonly apiService    = inject(ApiService);
  private readonly programsSvc   = inject(ProgramsService);
  private readonly registrationSvc = inject(RegistrationService);
  private readonly router        = inject(Router);

  // ── State ─────────────────────────────────────────────────────────
  protected readonly step           = signal<AuthStep>('email');
  protected readonly loading        = signal(false);
  protected readonly loadingPrograms = signal(false);
  protected readonly errorMsg       = signal('');
  protected readonly successMsg     = signal('');
  protected readonly programs       = signal<Program[]>([]);

  // ── Forms ─────────────────────────────────────────────────────────
  protected readonly emailCtrl = this.fb.nonNullable.control(
    '', [Validators.required, Validators.email, allowedEmailDomainValidator()]
  );

  protected readonly loginForm = this.fb.nonNullable.group({
    password: ['', [Validators.required]]
  });

  protected readonly registerForm = this.fb.nonNullable.group({
    password:  ['', [Validators.required, strongPasswordValidator()]],
    programId: ['', [Validators.required]]
  });

  // ── Init ──────────────────────────────────────────────────────────

  async ngOnInit(): Promise<void> {
    try {
      const session = await this.authService.initializeSession();
      if (session) await this.router.navigate(['/app/dashboard']);
    } catch { /* sin sesión activa */ }
  }

  // ── Paso 1: verificar correo ───────────────────────────────────────

  async checkEmail(): Promise<void> {
    this.emailCtrl.markAsTouched();
    if (this.emailCtrl.invalid) return;

    this.clearMessages();
    this.loading.set(true);
    try {
      const email = this.emailCtrl.value.trim().toLowerCase();
      this.emailCtrl.setValue(email);

      const res = await this.apiService.post<{ exists: boolean }>(
        '/auth/check-email', { email }
      );

      if (res.exists) {
        this.step.set('login');
      } else {
        await this.loadPrograms();
        this.step.set('register');
      }
    } catch {
      // Si la API no está disponible, intentar login directamente
      this.step.set('login');
    } finally {
      this.loading.set(false);
    }
  }

  // ── Paso 2a: login ────────────────────────────────────────────────

  async submitLogin(): Promise<void> {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }

    this.clearMessages();
    this.loading.set(true);
    try {
      const email    = this.emailCtrl.value;
      const password = this.loginForm.controls.password.getRawValue();
      await this.authService.login({ email, password });
      await this.router.navigate(['/app/dashboard']);
    } catch (err) {
      this.errorMsg.set(err instanceof Error ? err.message : 'Contraseña incorrecta.');
    } finally {
      this.loading.set(false);
    }
  }

  // ── Paso 2b: registro ─────────────────────────────────────────────

  async submitRegister(): Promise<void> {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }

    this.clearMessages();
    this.loading.set(true);
    try {
      const email     = this.emailCtrl.value;
      const password  = this.registerForm.controls.password.getRawValue();
      const programId = this.registerForm.controls.programId.getRawValue();
      await this.registrationSvc.register({ email, password, programId });
      await this.router.navigate(['/app/dashboard']);
    } catch (err) {
      this.errorMsg.set(err instanceof Error ? err.message : 'No se pudo crear la cuenta.');
    } finally {
      this.loading.set(false);
    }
  }

  // ── Recuperar contraseña ──────────────────────────────────────────

  goToRecover(): void {
    this.clearMessages();
    this.step.set('recover');
  }

  async submitRecover(): Promise<void> {
    if (this.emailCtrl.invalid) { this.emailCtrl.markAsTouched(); return; }

    this.clearMessages();
    this.loading.set(true);
    try {
      // TODO: conectar endpoint de reset cuando esté disponible en el backend
      await new Promise<void>(r => setTimeout(r, 400));
      this.successMsg.set(`Enlace enviado a ${this.emailCtrl.value}. Revisa tu bandeja.`);
    } catch (err) {
      this.errorMsg.set(err instanceof Error ? err.message : 'No se pudo enviar el enlace.');
    } finally {
      this.loading.set(false);
    }
  }

  // ── Navegación ────────────────────────────────────────────────────

  goBack(): void {
    this.clearMessages();
    if (this.step() === 'recover') { this.step.set('login'); return; }
    this.step.set('email');
    this.loginForm.reset();
    this.registerForm.reset();
  }

  // ── Privado ───────────────────────────────────────────────────────

  private clearMessages(): void {
    this.errorMsg.set('');
    this.successMsg.set('');
  }

  private async loadPrograms(): Promise<void> {
    if (this.programs().length > 0) return;
    this.loadingPrograms.set(true);
    try {
      this.programs.set(await this.programsSvc.listPrograms());
    } finally {
      this.loadingPrograms.set(false);
    }
  }
}
