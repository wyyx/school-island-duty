import { Injectable } from '@angular/core'
import { LoadingController } from '@ionic/angular'
import { ModalOptions, LoadingOptions } from '@ionic/core'

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  constructor(public loadingController: LoadingController) {}

  async openLoading(options: LoadingOptions) {
    const loading = await this.loadingController.create({
      ...options
    })

    loading.present()
    return loading
  }
}
