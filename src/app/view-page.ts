import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import type { ViewSpec } from './view-catalog';

@Component({
  selector: 'app-view-page',
  template: `
    <section class="view-card">
      <p class="eyebrow">{{ view().code }} · {{ view().area }}</p>
      <div class="title-row">
        <h1>{{ view().title }}</h1>
        <span class="badge">Vista placeholder</span>
      </div>
      <p class="summary">{{ view().summary }}</p>

      <dl class="meta-grid">
        <div>
          <dt>Ruta</dt>
          <dd>/{{ view().routePath }}</dd>
        </div>
        <div>
          <dt>Fase</dt>
          <dd>Sprint 1</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>Shell listo</dd>
        </div>
      </dl>

      <article class="callout">
        <h2>Próximo paso</h2>
        <p>Esta vista ya está conectada al router y puede recibir lógica específica en la siguiente iteración.</p>
      </article>
    </section>
  `,
  styleUrl: './view-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--accent]': 'view().accent'
  }
})
export class ViewPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly view = signal(this.route.snapshot.data['view'] as ViewSpec);
}