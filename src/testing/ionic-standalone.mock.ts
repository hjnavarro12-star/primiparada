import { Component, Input, Injectable } from '@angular/core';

@Component({
  selector: 'ion-app',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonApp {}

@Component({
  selector: 'ion-back-button',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonBackButton {
  @Input() defaultHref = '';
}

@Component({
  selector: 'ion-button',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonButton {}

@Component({
  selector: 'ion-buttons',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonButtons {}

@Component({
  selector: 'ion-card',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonCard {}

@Component({
  selector: 'ion-card-content',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonCardContent {}

@Component({
  selector: 'ion-card-header',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonCardHeader {}

@Component({
  selector: 'ion-card-title',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonCardTitle {}

@Component({
  selector: 'ion-col',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonCol {
  @Input() size: string | undefined;
  @Input() sizeLg: string | undefined;
  @Input() sizeMd: string | undefined;
  @Input() sizeSm: string | undefined;
}

@Component({
  selector: 'ion-content',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonContent {
  @Input() fullscreen = false;
}

@Component({
  selector: 'ion-grid',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonGrid {}

@Component({
  selector: 'ion-header',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonHeader {}

@Component({
  selector: 'ion-icon',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonIcon {
  @Input() name: string | undefined;
}

@Component({
  selector: 'ion-input',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonInput {
  @Input() label: string | undefined;
  @Input() labelPlacement: string | undefined;
  @Input() type: string | undefined;
  @Input() placeholder: string | undefined;
  @Input() autocomplete: string | undefined;
}

@Component({
  selector: 'ion-item',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonItem {}

@Component({
  selector: 'ion-label',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonLabel {}

@Component({
  selector: 'ion-list',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonList {}

@Component({
  selector: 'ion-list-header',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonListHeader {}

@Component({
  selector: 'ion-menu',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonMenu {}

@Component({
  selector: 'ion-menu-button',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonMenuButton {}

@Component({
  selector: 'ion-row',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonRow {}

@Component({
  selector: 'ion-select',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonSelect {
  @Input() label: string | undefined;
  @Input() labelPlacement: string | undefined;
  @Input() placeholder: string | undefined;
  @Input() disabled = false;
}

@Component({
  selector: 'ion-select-option',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonSelectOption {
  @Input() value: any;
}

@Component({
  selector: 'ion-skeleton-text',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonSkeletonText {}

@Component({
  selector: 'ion-split-pane',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonSplitPane {
  @Input() contentId: string | undefined;
  @Input() when: string | undefined;
}

@Component({
  selector: 'ion-title',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonTitle {}

@Component({
  selector: 'ion-toolbar',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonToolbar {}

@Component({
  selector: 'ion-alert',
  standalone: true,
  template: '<ng-content></ng-content>'
})
export class IonAlert {}

@Injectable({ providedIn: 'root' })
export class AlertController {
  private nextDismissRole: 'cancel' | 'destructive' | 'confirm' = 'cancel';

  setNextDismissRole(role: 'cancel' | 'destructive' | 'confirm'): void {
    this.nextDismissRole = role;
  }

  async create(_options: any) {
    const dismissRole = this.nextDismissRole;
    this.nextDismissRole = 'cancel';

    return {
      present: async () => {},
      onDidDismiss: async () => ({ role: dismissRole })
    };
  }
}
