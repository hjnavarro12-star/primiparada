import { Component, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { App as CapApp } from '@capacitor/app';
import { Router } from '@angular/router';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `
})
export class App implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private backButtonListener: PluginListenerHandle | null = null;

  async ngOnInit(): Promise<void> {
    this.backButtonListener = await CapApp.addListener('backButton', ({ canGoBack }) => {
      this.zone.run(() => {
        if (canGoBack) {
          window.history.back();
        } else {
          CapApp.exitApp();
        }
      });
    });
  }

  async ngOnDestroy(): Promise<void> {
    await this.backButtonListener?.remove();
  }
}
