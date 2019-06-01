import { Injectable } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { ComponentRef, ModalOptions } from '@ionic/core'

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalController: ModalController) {}

  async openModal(options: ModalOptions) {
    const modal = await this.modalController.create({
      ...options
    })

    modal.present()
    return modal
  }
}
