import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import { slideScaleAnim } from 'src/app/animations/slide-scale.anim'
import { DutyHistory } from 'src/app/models/duty.model'
import { DutyService } from 'src/app/services/duty.service'
import { dutyHistoryList } from 'src/app/mocks/duty.mock'
import { tap } from 'rxjs/operators'

moment.locale('zh-CN')

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  animations: [slideScaleAnim]
})
export class HistoryPage implements OnInit {
  dutyHistoryList: DutyHistory[]
  slideOpts = {
    initialSlide: 1,
    speed: 400
  }

  slideImgs: string[] = []
  showImgViewer = false

  constructor(private dutyService: DutyService) {}

  ngOnInit() {
    this.dutyHistoryList = dutyHistoryList
  }

  loadDutyHistoryList() {
    this.dutyService
      .getDutyHistoryList({
        classId: 0,
        pageNo: 0,
        pageSize: 100
      })
      .pipe(
        tap(res => {
          this.dutyHistoryList = res.content
        })
      )
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
