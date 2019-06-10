import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import { slideScaleAnim } from 'src/app/animations/slide-scale.anim'
import { DutyHistoryItem } from 'src/app/models/duty-db.model'
import { DutyService } from 'src/app/services/duty.service'
import { dbService } from 'src/app/storage/db.service'
// import { dbService } from 'src/app/mocks/db.mock.service'

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
  needUpload = false

  constructor(private dutyService: DutyService) {}

  ngOnInit() {
    this.loadDutyHistoryList()
    this.upload()
    this.intervalUpload()
  }

  ionViewWillEnter() {
    this.loadDutyHistoryList()
  }

  intervalUpload() {
    setInterval(() => {
      if (this.needUpload) {
        this.upload()
      }
    }, 1800000)
  }

  upload() {
    console.log('uploading')
    dbService.upload().then(() => {
      this.loadDutyHistoryList()
    })
  }

  loadDutyHistoryList() {
    dbService.historyList().then(res => {
      this.dutyHistoryList = res

      this.dutyHistoryList.forEach(historyItem => {
        if (historyItem.status === 0) {
          this.needUpload = true
        }
      })
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
