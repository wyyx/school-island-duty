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
      showCloseButton: true,
      duration: 2000,
      closeButtonText: '关闭',
      ...toastOptions
    })

    toast.present()
    return toast
  }
}
