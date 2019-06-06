import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import { slideScaleAnim } from 'src/app/animations/slide-scale.anim'
import { DutyHistory } from 'src/app/models/duty.model'
import { DutyService } from 'src/app/services/duty.service'
import { dutyHistoryList } from 'src/app/mocks/duty.mock'
import { tap } from 'rxjs/operators'
import { dbService } from 'src/app/storage/db.service'
import { convertToArray } from 'src/app/utils/sql.util'
import { Observable, from } from 'rxjs'
import { SubItemScoreHistory } from 'src/app/models/duty-db.model'

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
  subItemScoreHistory$: Observable<SubItemScoreHistory[]>

  constructor(private dutyService: DutyService) {}

  ngOnInit() {
    this.loadDutyHistoryList()
    this.getSubItemScoreHistory()

    this.subItemScoreHistory$
      .pipe(
        tap(resTap => {
          console.log('TCL: HistoryPage -> ngOnInit -> res mmmmmmm', resTap)
        })
      )
      .subscribe(res => {
        console.log('TCL: HistoryPage -> ngOnInit -> res', res)
      })
  }

  loadDutyHistoryList() {
    dbService.historyList().then(res => {
      console.log('TCL: HistoryPage -> loadDutyHistoryList -> res xxxxxxxxxxxxxxxxxxxxxxx', res)
      console.log('TCL: HistoryPage -> loadDutyHistoryList -> res xxxxxxxxxxxxxxxxxxxxxxx', res[0])
    })
  }

  getSubItemScoreHistory() {
    this.subItemScoreHistory$ = from(dbService.subItemScoreHistory(1, 1))
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
