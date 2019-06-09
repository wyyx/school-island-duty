import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import { slideScaleAnim } from 'src/app/animations/slide-scale.anim'
import { DutyHistoryItem } from 'src/app/models/duty-db.model'
import { DutyService } from 'src/app/services/duty.service'
// import { dbService } from 'src/app/storage/db.service'
import { dbService } from 'src/app/mocks/db.mock.service'

moment.locale('zh-CN')

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  animations: [slideScaleAnim]
})
export class HistoryPage implements OnInit {
  dutyHistoryList: DutyHistoryItem[]
  slideOpts = {
    initialSlide: 0,
    speed: 400
  }

  slideImgs: string[] = []
  showImgViewer = false

  constructor(private dutyService: DutyService) {}

  ngOnInit() {
    this.loadDutyHistoryList()
  }

  syncDb() {
    dbService.synchronizationData()
  }

  loadDutyHistoryList() {
    dbService.historyList().then(res => {
      console.log('TCL: HistoryPage -> loadDutyHistoryList -> res xxxxxxxxxxxxxxxxxxxxxxx', res)
      this.dutyHistoryList = res
    })
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
