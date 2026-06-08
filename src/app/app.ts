import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { App as CapacitorApp } from '@capacitor/app';

import { AuthService } from './core/services/auth.service';
import { VIEW_GROUPS, VIEW_SPECS } from './view-catalog';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand-card">
          <p class="eyebrow">Primiparada / Primíparos de la UnPa</p>
          <h1>Sprint 1</h1>
          <p class="brand-copy">
            Base de navegación, rutas lazy y preparación del proyecto para el flujo incremental.
          </p>
        </div>

        <dl class="stats">
          <div>
            <dt>Vistas</dt>
            <dd>{{ totalViews }}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>Angular 21</dd>
          </div>
          <div>
            <dt>Estado</dt>
            <dd>Scaffold listo</dd>
          </div>
        </dl>

        <section class="highlights">
          <p class="section-label">Criterios del sprint</p>
          <ul>
            @for (item of sprintHighlights; track item) {
              <li>{{ item }}</li>
            }
          </ul>
        </section>

        <nav class="navigation" aria-label="Mapa de vistas">
          @for (group of navigationGroups; track group.title) {
            <section class="group">
              <div class="group-heading">
                <h2>{{ group.title }}</h2>
                <p>{{ group.description }}</p>
              </div>

              <div class="group-links">
                @for (view of group.views; track view.code) {
                  <a
                    [routerLink]="['/', view.routePath]"
                    routerLinkActive="active"
                    class="view-link"
                  >
                    <span class="view-code">{{ view.code }}</span>
                    <span class="view-title">{{ view.title }}</span>
                  </a>
                }
              </div>
            </section>
          }
        </nav>
      </aside>

      <main class="workspace">
        <header class="workspace-header">
          <div>
            <p class="eyebrow">Metodología Scrun</p>
            <h2>Shell funcional para avanzar tarea por tarea</h2>
            <p>
              El desarrollador #1 trabaja sobre una base estable; el desarrollador #2 valida cada entrega.
            </p>
          </div>

          <div class="workspace-card">
            <span>Ruta actual</span>
            <strong>V1-V31 configuradas</strong>
          </div>
        </header>

        <section class="workspace-panel">
          <router-outlet />
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100dvh;
        color: #f3f7fb;
        --surface: rgba(7, 18, 34, 0.78);
        --surface-strong: rgba(12, 25, 44, 0.96);
        --surface-soft: rgba(255, 255, 255, 0.08);
        --border: rgba(173, 204, 235, 0.16);
        --accent: #4ecdc4;
        --accent-2: #ff9f1c;
        font-family: "Segoe UI", "Aptos", "Trebuchet MS", sans-serif;
        background:
          radial-gradient(circle at top left, rgba(78, 205, 196, 0.25), transparent 32%),
          radial-gradient(circle at top right, rgba(255, 159, 28, 0.18), transparent 28%),
          linear-gradient(135deg, #04111f 0%, #081a2d 42%, #0d2238 100%);
      }

      .shell {
        display: grid;
        grid-template-columns: minmax(20rem, 23rem) minmax(0, 1fr);
        min-height: 100dvh;
      }

      .sidebar {
        display: grid;
        gap: 1.25rem;
        padding: 1.5rem;
        border-right: 1px solid var(--border);
        background: rgba(4, 13, 26, 0.58);
        backdrop-filter: blur(18px);
      }

      .brand-card,
      .stats,
      .highlights,
      .group,
      .workspace-header,
      .workspace-panel,
      .workspace-card {
        border: 1px solid var(--border);
        background: var(--surface);
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
      }

      .brand-card,
      .workspace-header,
      .workspace-panel,
      .workspace-card {
        border-radius: 1.5rem;
      }

      .brand-card {
        padding: 1.25rem;
      }

      .eyebrow,
      .section-label,
      .group-heading p,
      .workspace-card span,
      .stats dt {
        margin: 0;
        color: rgba(217, 231, 245, 0.72);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.72rem;
      }

      .brand-card h1,
      .workspace-header h2 {
        margin: 0.35rem 0 0;
        line-height: 1.03;
        letter-spacing: -0.05em;
      }

      .brand-card h1 {
        font-size: 2rem;
      }

      .brand-copy,
      .workspace-header p,
      .group-heading p,
      .highlights li,
      .view-link,
      .stats dd {
        color: rgba(235, 244, 252, 0.88);
      }

      .stats {
        margin: 0;
        padding: 1rem;
        border-radius: 1.25rem;
        display: grid;
        gap: 0.75rem;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .stats div {
        padding: 0.75rem;
        border-radius: 1rem;
        background: var(--surface-soft);
      }

      .stats dd {
        margin: 0.25rem 0 0;
        font-size: 1.05rem;
        font-weight: 700;
      }

      .highlights {
        padding: 1rem 1.1rem;
        border-radius: 1.25rem;
      }

      .highlights ul,
      .group-links {
        display: grid;
        gap: 0.5rem;
      }

      .highlights ul {
        margin: 0.6rem 0 0;
        padding-left: 1rem;
      }

      .navigation {
        display: grid;
        gap: 1rem;
      }

      .group {
        padding: 1rem;
        border-radius: 1.35rem;
      }

      .group-heading h2,
      .workspace-header h2 {
        margin: 0;
        font-size: 1.15rem;
      }

      .group-links {
        margin-top: 0.75rem;
      }

      .view-link {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.8rem 0.9rem;
        border-radius: 0.95rem;
        text-decoration: none;
        border: 1px solid transparent;
        background: rgba(255, 255, 255, 0.03);
        transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;
      }

      .view-link:hover,
      .view-link.active {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--accent) 52%, white 20%);
        background: color-mix(in srgb, var(--accent) 14%, transparent);
      }

      .view-code {
        color: var(--accent);
        font-weight: 700;
      }

      .view-title {
        text-align: right;
      }

      .workspace {
        padding: 1.5rem;
        display: grid;
        gap: 1rem;
      }

      .workspace-header {
        padding: 1.25rem 1.35rem;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: end;
        background: var(--surface-strong);
      }

      .workspace-header p {
        margin: 0.5rem 0 0;
        max-width: 58ch;
      }

      .workspace-card {
        min-width: 14rem;
        padding: 1rem;
        background: linear-gradient(135deg, rgba(78, 205, 196, 0.16), rgba(255, 159, 28, 0.12));
      }

      .workspace-card strong {
        display: block;
        margin-top: 0.45rem;
        font-size: 1.05rem;
      }

      .workspace-panel {
        min-height: calc(100dvh - 12rem);
        padding: 1rem;
        background: rgba(5, 15, 28, 0.48);
      }

      @media (max-width: 1120px) {
        .shell {
          grid-template-columns: 1fr;
        }

        .sidebar {
          border-right: 0;
          border-bottom: 1px solid var(--border);
        }

        .workspace-panel {
          min-height: auto;
        }
      }

      @media (max-width: 720px) {
        .sidebar,
        .workspace {
          padding: 1rem;
        }

        .stats {
          grid-template-columns: 1fr;
        }

        .workspace-header {
          align-items: start;
          flex-direction: column;
        }

        .view-link {
          flex-direction: column;
          gap: 0.2rem;
        }

        .view-title {
          text-align: left;
        }
      }
    `
  ]
})
export class App implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly alertController = inject(AlertController);
  private readonly authService = inject(AuthService);
  private backButtonHandle: { remove: () => Promise<void> } | null = null;

  protected readonly totalViews = VIEW_SPECS.length;
  protected readonly navigationGroups = VIEW_GROUPS;
  protected readonly sprintHighlights = [
    'Angular 21 standalone en shell limpio',
    'Rutas V1-V31 lazy-load listadas',
    'Base lista para Supabase y fases siguientes'
  ];

  ngOnInit(): void {
    void this.registerBackButtonListener();
  }

  async ngOnDestroy(): Promise<void> {
    if (this.backButtonHandle) {
      await this.backButtonHandle.remove();
    }
  }

  private async registerBackButtonListener(): Promise<void> {
    this.backButtonHandle = await CapacitorApp.addListener('backButton', () => {
      void this.handleBackButton();
    });
  }

  private async handleBackButton(): Promise<void> {
    const currentUrl = this.router.url;

    if (currentUrl.startsWith('/access/v4')) {
      const shouldLogout = await this.confirmAction('¿Cerrar sesión?', 'Tu sesión se cerrará y volverás al acceso.');
      if (shouldLogout) {
        await this.authService.signOut();
        await this.router.navigateByUrl('/access/v2');
      }
      return;
    }

    if (currentUrl.startsWith('/access/')) {
      const shouldExit = await this.confirmAction('¿Salir de la aplicación?', 'Estás a punto de cerrar Primiparada.');
      if (shouldExit) {
        await CapacitorApp.exitApp();
      }
      return;
    }

    this.location.back();
  }

  private async confirmAction(header: string, message: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          role: 'destructive'
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    return result.role === 'destructive';
  }
}
