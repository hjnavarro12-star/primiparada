import { Component, Input, Injectable } from '@angular/core';

function mockIonicComponent(selector: string) {
  @Component({
    selector,
    standalone: true,
    template: '<ng-content></ng-content>'
  })
  class IonicMockComponent {}

  return IonicMockComponent;
}

export const IonButton = mockIonicComponent('ion-button');
export const IonButtons = mockIonicComponent('ion-buttons');
export const IonCard = mockIonicComponent('ion-card');
export const IonCardContent = mockIonicComponent('ion-card-content');
export const IonCardHeader = mockIonicComponent('ion-card-header');
export const IonCardTitle = mockIonicComponent('ion-card-title');
@Component({
  selector: 'ion-content',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonContent {
  @Input() fullscreen = false;
}
export const IonHeader = mockIonicComponent('ion-header');
export const IonItem = mockIonicComponent('ion-item');
export const IonLabel = mockIonicComponent('ion-label');
export const IonList = mockIonicComponent('ion-list');
export const IonMenu = mockIonicComponent('ion-menu');
export const IonMenuButton = mockIonicComponent('ion-menu-button');
export const IonSkeletonText = mockIonicComponent('ion-skeleton-text');
export const IonTitle = mockIonicComponent('ion-title');
export const IonToolbar = mockIonicComponent('ion-toolbar');
export const IonAlert = mockIonicComponent('ion-alert');

@Injectable({ providedIn: 'root' })
export class AlertController {
  async create(options: any) {
    return {
      present: async () => {},
      onDidDismiss: async () => ({ role: 'cancel' })
    };
  }
}
