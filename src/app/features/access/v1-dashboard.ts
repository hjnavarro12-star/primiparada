import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRow,
  IonSkeletonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-v1-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonSkeletonText
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Primíparos de la UnPa</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding">
      <!-- Hero section -->
      <div class="hero">
        <h1>Bienvenido a Primiparada</h1>
        <p>Tu guía en el campus universitario. Encuentra tus clases, navega por la universidad y nunca llegues tarde.</p>
      </div>

      <ion-grid>
        <!-- Video introductorio -->
        <ion-row>
          <ion-col size="12" size-lg="8">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Video introductorio</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <div class="video-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/wvl6M7aZHnY"
                    title="Video introductorio de la Universidad del Pacífico"
                    frameborder="0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <!-- Noticias -->
          <ion-col size="12" size-lg="4">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Noticias UnPa</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                @if (newsIframeEnabled()) {
                  <div class="news-wrapper">
                    <iframe
                      src="https://unipacifico.edu.co/"
                      title="Noticias institucionales"
                      loading="lazy"
                      sandbox="allow-same-origin allow-scripts allow-forms"
                      (load)="onNewsLoaded()"
                    ></iframe>
                  </div>
                }
                @if (!newsReady() && showSkeletonFallback()) {
                  <ion-skeleton-text [animated]="true" style="height: 24px; width: 80%"></ion-skeleton-text>
                  <ion-skeleton-text [animated]="true" style="height: 24px; width: 60%"></ion-skeleton-text>
                  <ion-skeleton-text [animated]="true" style="height: 24px; width: 70%"></ion-skeleton-text>
                }
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <!-- Botones de acceso -->
        <ion-row class="ion-margin-top">
          <ion-col size="12" size-md="6">
            <ion-button expand="block" routerLink="/access/v2">
              Iniciar sesión
            </ion-button>
          </ion-col>
          <ion-col size="12" size-md="6">
            <ion-button expand="block" fill="outline" routerLink="/access/v3">
              Registrarse
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 2rem 1rem;
    }

    .hero h1 {
      font-size: clamp(1.6rem, 5vw, 2.5rem);
      margin: 0 0 0.75rem;
      font-weight: 700;
    }

    .hero p {
      margin: 0 auto;
      max-width: 50ch;
      color: var(--ion-text-color);
      opacity: 0.85;
      line-height: 1.6;
    }

    .video-wrapper {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      border-radius: 8px;
    }

    .video-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }

    .news-wrapper {
      height: 250px;
      overflow: hidden;
      border-radius: 8px;
    }

    .news-wrapper iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }

    ion-card {
      margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V1Dashboard implements OnInit, OnDestroy {
  protected readonly newsIframeEnabled = signal(false);
  protected readonly newsReady = signal(false);
  protected readonly showSkeletonFallback = signal(false);

  private timeoutHandle: ReturnType<typeof setTimeout> | null = null;
  private lazyStartHandle: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.lazyStartHandle = setTimeout(() => this.newsIframeEnabled.set(true), 400);
    this.timeoutHandle = setTimeout(() => {
      if (!this.newsReady()) this.showSkeletonFallback.set(true);
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
    if (this.lazyStartHandle) clearTimeout(this.lazyStartHandle);
  }

  protected onNewsLoaded(): void {
    this.newsReady.set(true);
    this.showSkeletonFallback.set(false);
  }
}
