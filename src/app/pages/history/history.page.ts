import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import { BehaviorSubject } from 'rxjs'
import { tap } from 'rxjs/operators'
import { slideScaleAnim } from 'src/app/animations/slide-scale.anim'
import { DutyHistoryItem } from 'src/app/models/duty-db.model'
import { DutyService } from 'src/app/services/duty.service'
import { LoadingService } from 'src/app/services/loading.service'
import { dbService } from 'src/app/storage/db.service'
import { dateUtil } from 'src/app/utils/date.util'
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

  isLoadingSubject$ = new BehaviorSubject<boolean>(false)
  isLoading$ = this.isLoadingSubject$.asObservable()

  constructor(private dutyService: DutyService, private loadingService: LoadingService) {}

  ngOnInit() {
    this.showLoading()
    this.loadDutyHistoryList()
    this.upload()
    this.intervalUpload()
  }

  showLoading() {
    const loadingPromise = this.loadingService.openLoading({
      message: '正在加载数据...'
    })

    this.isLoading$
      .pipe(
        tap(isLoading => {
          if (!isLoading) {
            loadingPromise.then(loading => {
              loading.dismiss()
            })
          }
        })
      )
      .subscribe()
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
    this.isLoadingSubject$.next(true)

    dbService.historyList().then(res => {
      this.dutyHistoryList = res

      this.dutyHistoryList.forEach(historyItem => {
        if (historyItem.status === 0) {
          this.needUpload = true
        }
      })

      this.isLoadingSubject$.next(false)
    })
  }

  getTime(date: string) {
    return dateUtil.getTime(date)
  }

  getDate(date: string) {
    return dateUtil.getDate(date)
  }

  openImgViewer(imgs: string[]) {
    this.slideImgs = imgs
    this.showImgViewer = true
  }

  tapSlideImg() {
    this.showImgViewer = false
  }
}
