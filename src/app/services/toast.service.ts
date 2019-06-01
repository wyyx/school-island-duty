import { ToastController } from '@ionic/angular'
import { Injectable } from '@angular/core'
import { ToastOptions } from '@ionic/core'

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(public toastController: ToastController) {}

  async showToast(toastOptions: ToastOptions) {
    const toast = await this.toastController.create({
      ...toastOptions
    })

    toast.present()
    return toast
  }
}
