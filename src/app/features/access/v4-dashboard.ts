import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { dayLabel } from '../../shared/utils/day-label.util';
import type { Schedule } from '../../shared/models/schedule.model';

@Component({
  selector: 'app-v4-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenu,
    IonList,
    IonItem,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ],
  template: `
    <ion-menu side="start" contentId="v4-main-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menú</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item routerLink="/alerts/v5">Alertas</ion-item>
          <ion-item routerLink="/schedule/v24">Mi horario</ion-item>
          <ion-item routerLink="/campus/v7">Directorio campus</ion-item>
          <ion-item routerLink="/settings/v26">Configuración</ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>

    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button aria-label="Abrir menú principal"></ion-menu-button>
        </ion-buttons>
        <ion-title>V4 · Dashboard Privado</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content id="v4-main-content" [fullscreen]="true" class="v4-content">
      <div class="container py-3 px-3 px-md-4">
        <div class="row g-3">
          <div class="col-12">
            <ion-card class="next-class-card">
              <ion-card-header>
                <ion-card-title>Próxima clase</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                @if (nextClass()) {
                  <div class="class-grid">
                    <p><strong>{{ nextClass()!.subject }}</strong></p>
                    <p>{{ dayLabel(nextClass()!.day_of_week) }} · {{ nextClass()!.start_time }} - {{ nextClass()!.end_time }}</p>
                    <p>{{ nextClass()!.room_label || 'Salón por definir' }}</p>
                  </div>
                } @else {
                  <p>Sin clases próximas registradas.</p>
                }
              </ion-card-content>
            </ion-card>
          </div>

          <div class="col-12 col-lg-7">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Horario embebido</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                @if (nextClass()) {
                  <p>Resumen rápido activo. El detalle completo está disponible en el Gestor de Horario.</p>
                  <ion-button fill="outline" color="light" routerLink="/schedule/v24">Abrir gestor de horario</ion-button>
                } @else {
                  <p>Sin horario aún.</p>
                  <ion-button fill="outline" color="light" routerLink="/schedule/v21">Crear mi horario</ion-button>
                }
              </ion-card-content>
            </ion-card>
          </div>

          <div class="col-12 col-lg-5">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Noticias</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <div class="news-frame-wrapper" [attr.aria-busy]="!newsReady()">
                  @if (newsEnabled()) {
                    <iframe
                      src="https://unipacifico.edu.co/"
                      title="Noticias privadas"
                      loading="lazy"
                      sandbox="allow-same-origin allow-scripts allow-forms"
                      (load)="onNewsLoaded()"
                    ></iframe>
                  }

                  @if (!newsReady() && showNewsFallback()) {
                    <p class="fallback">Cargando noticias...</p>
                  }
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .v4-content {
        --background: radial-gradient(circle at 20% 12%, #2b4c7a 0%, #18293f 36%, #0c1727 70%, #09111d 100%);
      }

      ion-card {
        margin: 0;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(7, 15, 28, 0.76);
      }

      .next-class-card {
        background: linear-gradient(135deg, rgba(46, 112, 170, 0.9), rgba(76, 66, 150, 0.9));
      }

      .class-grid p {
        margin: 0 0 0.35rem;
      }

      .news-frame-wrapper {
        min-height: 210px;
      }

      .news-frame-wrapper iframe {
        width: 100%;
        min-height: 210px;
        border: 0;
        border-radius: 10px;
      }

      .fallback {
        margin: 0;
      }

      ion-button {
        min-height: 44px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V4Dashboard implements OnInit, OnDestroy {
  private readonly scheduleService = inject(ScheduleService);
  private readonly authService = inject(AuthService);
  private readonly alertController = inject(AlertController);
  private readonly router = inject(Router);
  private scheduleSub: Subscription | null = null;
  private newsDelayHandle: ReturnType<typeof setTimeout> | null = null;
  private newsTimeoutHandle: ReturnType<typeof setTimeout> | null = null;

  protected readonly nextClass = signal<Schedule | null>(null);
  protected readonly newsEnabled = signal(false);
  protected readonly newsReady = signal(false);
  protected readonly showNewsFallback = signal(false);

  ngOnInit(): void {
    this.scheduleSub = this.scheduleService.nextClass$.subscribe((item) => {
      this.nextClass.set(item);
    });

    this.newsDelayHandle = setTimeout(() => {
      this.newsEnabled.set(true);
    }, 450);

    this.newsTimeoutHandle = setTimeout(() => {
      if (!this.newsReady()) {
        this.showNewsFallback.set(true);
      }
    }, 3000);
  }

  ngOnDestroy(): void {
    this.scheduleSub?.unsubscribe();

    if (this.newsDelayHandle) {
      clearTimeout(this.newsDelayHandle);
    }

    if (this.newsTimeoutHandle) {
      clearTimeout(this.newsTimeoutHandle);
    }
  }

  protected onNewsLoaded(): void {
    this.newsReady.set(true);
    this.showNewsFallback.set(false);
  }

  protected dayLabel(day: number): string {
    return dayLabel(day);
  }

  async canExit(): Promise<boolean> {
    const alert = await this.alertController.create({
      header: '¿Cerrar sesión?',
      message: 'Tu sesión se cerrará y volverás al acceso de la aplicación.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar sesión',
          role: 'destructive'
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    if (result.role !== 'destructive') {
      return false;
    }

    await this.authService.signOut();
    await this.router.navigate(['/access/v2']);
    return false;
  }
}
