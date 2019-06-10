import { Component, OnInit } from '@angular/core'
import { ModalService } from 'src/app/services/modal.service'
import { ModalController } from '@ionic/angular'
import { SubItemScoreHistoryItem } from 'src/app/models/duty-db.model'
import { slideScaleAnim } from 'src/app/animations/slide-scale.anim'
import { dateUtil } from 'src/app/utils/date.util'

@Component({
  selector: 'app-week-history-modal',
  templateUrl: './week-history-modal.component.html',
  styleUrls: ['./week-history-modal.component.scss'],
  animations: [slideScaleAnim]
})
export class WeekHistoryModalComponent implements OnInit {
  subItemScoreHistory: SubItemScoreHistoryItem[] = []
  slideOpts = {
    initialSlide: 0,
    speed: 400
  }

  slideImgs: string[] = []
  showImgViewer = false

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss()
  }

  openImgViewer(imgs: string[]) {
    this.slideImgs = imgs
    this.showImgViewer = true
  }

  tapSlideImg() {
    this.showImgViewer = false
  }

  getTime(date: string) {
    return dateUtil.getTime(date)
  }

  getDate(date: string) {
    return dateUtil.getDate(date)
  }
}
