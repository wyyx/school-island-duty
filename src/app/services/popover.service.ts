import { Injectable } from '@angular/core'
import { PopoverController } from '@ionic/angular'
import { PopoverOptions } from '@ionic/core'

@Injectable({
  providedIn: 'root'
})
export class PopoverService {
  constructor(private popoverController: PopoverController) {}

  async openPopover(options: PopoverOptions) {
    const popover = await this.popoverController.create({
      ...options
    })

    popover.present()
    return popover
  }
}
