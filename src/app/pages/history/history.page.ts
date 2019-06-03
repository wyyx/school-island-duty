import { Component, OnInit } from '@angular/core'
import { DutyHistory, dutyHistories } from 'src/app/services/duty.service'

import * as moment from 'moment'
import { slideScaleAnim } from 'src/app/animations/slide-scale.anim'
moment.locale('zh-CN')

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  animations: [slideScaleAnim]
})
export class HistoryPage implements OnInit {
  dutyHistories: DutyHistory[]
  slideOpts = {
    initialSlide: 1,
    speed: 400
  }

  slideImgs: string[] = []
  showImgViewer = false

  constructor() {}

  ngOnInit() {
    this.dutyHistories = dutyHistories
  }

  getTime(date: string) {
    return moment(date).format('H:mm')
  }

  getDate(date: string) {
    return moment(date).format('YYYY.M.D')
  }

  openImgViewer(imgs: string[]) {
    this.slideImgs = imgs
    this.showImgViewer = true
  }

  tapSlideImg() {
    this.showImgViewer = false
  }
}
