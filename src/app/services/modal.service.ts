import { Injectable } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { ComponentRef } from '@ionic/core'

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalController: ModalController) {}

  async openModal(modalType: ComponentRef, dismissCurrentModal: boolean = false) {
    if (dismissCurrentModal) {
      this.modalController.dismiss()
    }

    const modal = await this.modalController.create({
      component: modalType,
      showBackdrop: true
    })

    modal.present()
    return modal
  }
}
