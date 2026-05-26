import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v1-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="public-hero">
      <header class="hero">
        <h1>Primíparos — Bienvenido</h1>
        <p>Portal público con video introductorio y accesos a iniciar sesión o registrarse.</p>
      </header>

      <article class="panel">
        <div class="actions">
          <a routerLink="/access/v2">Iniciar Sesión</a>
          <a routerLink="/access/v3">Registro</a>
        </div>

        <div class="iframe-placeholder">Aquí irá el iframe de noticias (lazy-load en Fase 2).</div>
      </article>
    </section>
  `,
  styles: [
    `
      .hero, .panel { background: rgba(12,16,31,0.95); padding:1rem; border-radius:12px; color:#f7fbff }
      .actions { display:flex; gap:0.5rem; margin-top:1rem }
      .iframe-placeholder { height:180px; background: rgba(255,255,255,0.02); border-radius:8px; margin-top:1rem }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V1Dashboard {}
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-v1-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero-shell">
      <header>
        <h1>Primíparos — Bienvenidos</h1>
        <p>Portal público con acceso a inicio de sesión y registro.</p>
      </header>

      <article class="panel">
        <div class="video-placeholder">[Video introductorio]</div>
        <div class="actions">
          <a routerLink="/access/v2">Iniciar Sesión</a>
          <a routerLink="/access/v3">Registro</a>
        </div>
      </article>
    </section>
  `,
  styles: [
    `
      .video-placeholder { height:220px; background:rgba(255,255,255,0.03); border-radius:12px; display:flex; align-items:center; justify-content:center }
      .actions { display:flex; gap:0.75rem; margin-top:1rem }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V1Dashboard {}
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonContent, IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-v1-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonSkeletonText
  ],
  template: `
    <ion-content [fullscreen]="true" class="v1-content">
      <section class="hero-section">
        <div class="container py-4 px-3 px-md-4">
          <div class="row">
            <div class="col-12">
              <p class="eyebrow">V1 · Dashboard Público</p>
              <h1>Bienvenidos a Primíparos de la UnPa</h1>
              <p class="summary">Noticias e información para estudiantes de primer semestre.</p>
            </div>
          </div>

          <div class="row g-3 mt-1">
            <div class="col-12 col-lg-8">
              <ion-card class="video-card">
                <ion-card-content>
                  <iframe
                    src="https://www.youtube.com/embed/wvl6M7aZHnY"
                    title="Video introductorio de la Universidad del Pacífico"
                    frameborder="0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </ion-card-content>
              </ion-card>
            </div>

            <div class="col-12 col-lg-4">
              <ion-card class="news-card">
                <ion-card-content>
                  <h2>Noticias UnPa</h2>
                  <div class="news-frame-wrapper" [attr.aria-busy]="!newsReady()">
                    @if (newsIframeEnabled()) {
                      <iframe
                        src="https://unipacifico.edu.co/"
                        title="Noticias institucionales de la Universidad del Pacífico"
                        loading="lazy"
                        sandbox="allow-same-origin allow-scripts allow-forms"
                        (load)="onNewsLoaded()"
                      ></iframe>
                    }

                    @if (!newsReady() && showSkeletonFallback()) {
                      <div class="skeleton-stack" role="status" aria-live="polite">
                        <p>Cargando noticias...</p>
                        <ion-skeleton-text [animated]="true"></ion-skeleton-text>
                        <ion-skeleton-text [animated]="true"></ion-skeleton-text>
                        <ion-skeleton-text [animated]="true"></ion-skeleton-text>
                      </div>
                    }
                  </div>
                </ion-card-content>
              </ion-card>
            </div>
          </div>

          <div class="row g-2 mt-1">
            <div class="col-12 col-md-6">
              <ion-button
                expand="block"
                fill="outline"
                color="light"
                routerLink="/access/v2"
                aria-label="Ir a iniciar sesión"
              >
                Iniciar sesión
              </ion-button>
            </div>
            <div class="col-12 col-md-6">
              <ion-button
                expand="block"
                fill="outline"
                color="light"
                routerLink="/access/v3"
                aria-label="Ir a registro"
              >
                Registrarse
              </ion-button>
            </div>
          </div>
        </div>
      </section>
    </ion-content>
  `,
  styles: [
    `
      .v1-content {
        --background: radial-gradient(circle at 15% 20%, #2d5f91 0%, #0f2b46 32%, #07111d 72%, #050a13 100%);
      }

      .hero-section {
        min-height: 100%;
        color: #f7fbff;
      }

      .eyebrow {
        color: #9ad8ff;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        margin: 0 0 0.5rem;
        font-size: 0.75rem;
      }

      h1 {
        margin: 0;
        font-size: clamp(1.9rem, 5vw, 2.8rem);
      }

      .summary {
        margin: 0.65rem 0 0;
        max-width: 64ch;
      }

      ion-card {
        margin: 0;
        border-radius: 12px;
        background: rgba(6, 14, 27, 0.72);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }

      .video-card iframe,
      .news-card iframe {
        width: 100%;
        border: 0;
        border-radius: 10px;
        background: #050b16;
      }

      .video-card iframe {
        min-height: 230px;
        height: clamp(230px, 48vw, 360px);
      }

      .news-card h2 {
        margin: 0 0 0.65rem;
        font-size: 1rem;
      }

      .news-frame-wrapper {
        min-height: 230px;
        position: relative;
      }

      .news-card iframe {
        min-height: 230px;
        height: 230px;
      }

      .skeleton-stack {
        display: grid;
        gap: 0.55rem;
      }

      .skeleton-stack p {
        margin: 0;
        font-size: 0.95rem;
      }

      .skeleton-stack ion-skeleton-text {
        --border-radius: 8px;
        height: 34px;
      }

      ion-button {
        min-height: 44px;
        --border-radius: 12px;
      }

      @media (max-width: 992px) {
        .news-card iframe,
        .news-frame-wrapper {
          min-height: 200px;
          height: 200px;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class V1Dashboard implements OnInit, OnDestroy {
  protected readonly newsIframeEnabled = signal(false);
  protected readonly newsReady = signal(false);
  protected readonly showSkeletonFallback = signal(false);

  private timeoutHandle: ReturnType<typeof setTimeout> | null = null;
  private lazyStartHandle: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    // Delay the iframe mount slightly to avoid loading external content during first paint.
    this.lazyStartHandle = setTimeout(() => {
      this.newsIframeEnabled.set(true);
    }, 400);

    // If iframe is still not ready after 3 seconds, present a skeleton fallback.
    this.timeoutHandle = setTimeout(() => {
      if (!this.newsReady()) {
        this.showSkeletonFallback.set(true);
      }
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    if (this.lazyStartHandle) {
      clearTimeout(this.lazyStartHandle);
    }
  }

  protected onNewsLoaded(): void {
    this.newsReady.set(true);
    this.showSkeletonFallback.set(false);
  }
}
