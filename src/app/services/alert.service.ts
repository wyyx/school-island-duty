import { Injectable } from '@angular/core'
import { AlertController } from '@ionic/angular'
import { AlertOptions } from '@ionic/core'

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(public alertCtrl: AlertController) {}

  async showAlert(alertOptions: AlertOptions) {
    const alert = await this.alertCtrl.create({
      ...alertOptions
    })

    alert.present()
    return alert
  }
}
