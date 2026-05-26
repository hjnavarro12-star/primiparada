import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';

export interface ComponentCanExit {
  canExit(): boolean | Observable<boolean> | Promise<boolean>;
}

@Injectable({ providedIn: 'root' })
export class ExitGuard implements CanDeactivate<ComponentCanExit> {
  constructor(private alertController: AlertController) {}

  async canDeactivate(component: ComponentCanExit): Promise<boolean> {
    // Si el componente tiene lógica de salida personalizada, usarla
    if (component && component.canExit) {
      const canExit = component.canExit();
      if (typeof canExit === 'boolean') {
        return canExit;
      }
      if (canExit instanceof Promise) {
        return await canExit;
      }
      return await (canExit as Observable<boolean>).toPromise() as boolean;
    }

    // Mostrar modal de confirmación
    return this.confirmExit();
  }

  private async confirmExit(): Promise<boolean> {
    const alert = await this.alertController.create({
      header: '¿Salir de la aplicación?',
      message: 'Estás a punto de cerrar Primíparos de la UnPa.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => false,
        },
        {
          text: 'Salir',
          role: 'destructive',
          handler: () => { App.exitApp(); return true; },
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    return result.role === 'destructive';
  }
}

