import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { IonSelect } from '@ionic/angular'
import { Observable, BehaviorSubject, from } from 'rxjs'
import { listAnim } from 'src/app/animations/list.anim'
import { SelectScoreModalComponent } from 'src/app/components/select-score-modal/select-score-modal.component'
// import { dbService } from 'src/app/storage/db.service'
import { dbService } from 'src/app/mocks/db.mock.service'
import {
  AClass,
  CheckItem,
  CheckSubItem,
  Grade,
  SubItemScoreHistoryItem
} from 'src/app/models/duty-db.model'
import { DeductionCatetoryModified, DeductionModified } from 'src/app/models/duty.model'
import { PopoverService } from 'src/app/services/popover.service'
import { ToastService } from 'src/app/services/toast.service'
import { convertToArray } from 'src/app/utils/sql.util'
import { switchMap, map, filter, take } from 'rxjs/operators'

const SIZE_PRE_SLIDE = 5

@Component({
  selector: 'app-duty',
  templateUrl: './duty.page.html',
  styleUrls: ['./duty.page.scss'],
  animations: [listAnim]
})
export class DutyPage implements OnInit, AfterViewInit {
  @ViewChild('gradeSelect') gradeSelect: IonSelect

  grades: Grade[] = []
  currentGrade: Grade = {} as Grade
  currentClass: AClass = {} as AClass

  checkItems: CheckItem[] = []
  classSubject$ = new BehaviorSubject<AClass>(null)
  currentClass$ = this.classSubject$.asObservable()

  subItemScoreHistory$: Observable<SubItemScoreHistoryItem[]>

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  }

  get currentClassFullName() {
    return this.currentGrade.grade && this.currentClass.name
      ? this.currentGrade.grade + this.currentClass.name
      : '未选班级'
  }

  constructor(private popoverService: PopoverService, private toastService: ToastService) {}

  ngOnInit() {
    this.loadGrades()
    this.loadCheckItems()
    this.subItemScoreHistory$ = this.currentClass$.pipe(
      switchMap(aclass => {
        console.log('TCL: DutyPage -> ngOnInit -> aclass', aclass)
        return from(dbService.subItemScoreHistory(aclass.class_id))
      }),
      map(list => list || [])
    )
  }

  ngAfterViewInit(): void {}

  getSubItemScoreHistory(subItem: CheckSubItem) {
    return this.subItemScoreHistory$.pipe(
      map(list =>
        list.filter(scoreItem => scoreItem.check_sub_id === subItem.duty_check_sub_item_config_id)
      ),
      take(1)
    )
  }

  openSelectGrade(event) {
    this.gradeSelect.open(event)
  }

  setInitData() {
    this.setInitGrade()
    this.setInitClass()
  }

  setInitGrade() {
    const firstGrade = this.grades[0]

    if (firstGrade) {
      this.currentGrade = firstGrade
    }
  }

  setInitClass() {
    if (
      this.currentGrade &&
      this.currentGrade.classList &&
      this.currentGrade.classList.length > 0
    ) {
      this.currentClass = this.currentGrade.classList[0]
      this.classSubject$.next(this.currentClass)
    }
  }

  openSelectScorePopover(subItem: CheckSubItem) {
    const popover = this.popoverService
      .openPopover({
        component: SelectScoreModalComponent,
        cssClass: 'select-score-popover',
        backdropDismiss: false
      })
      .then(res => {
        return res.onDidDismiss()
      })
      .then(detail => {
        const score = detail.data

        // modify score
        if (score && score !== 0) {
          subItem.scoreChange = score
        }
      })
  }

  submit(category: DeductionCatetoryModified, option: DeductionModified) {
    // const data: DeductionPost = {
    //   autograph: '',
    //   checkSub: [
    //     {
    //       addressList: [],
    //       change_score: -option.score,
    //       check_sub_id: option.deductionOption.id,
    //       check_sub_name: option.deductionOption.rule,
    //       is_media: 1
    //     }
    //   ],
    //   check_id: category.id,
    //   check_name: category.category,
    //   class_id: this.currentClass.id
    // }
    // dbService
    //   .saveScore(data)
    //   .then(() => {
    //     this.toastService.showToast({
    //       message: '您已经成功提交本次值周记录！',
    //       showCloseButton: true,
    //       closeButtonText: '关闭',
    //       color: 'success',
    //       duration: 2000
    //     })
    //     this.resetSubItem(option)
    //   })
    //   .catch(error => {
    //     this.toastService.showToast({
    //       message: '提交失败！出现意外错误，请稍后再试.',
    //       showCloseButton: true,
    //       closeButtonText: '关闭',
    //       color: 'danger',
    //       duration: 2000
    //     })
    //   })
  }

  resetSubItem(subItem: DeductionModified) {
    subItem.score = 0
    subItem.imgUrls = []
  }

  loadCheckItems() {
    dbService.allItemList().then(itemList => {
      this.checkItems = itemList
    })
  }

  loadGrades() {
    dbService
      .gradeList()
      .then(convertToArray)
      .then(gradeList => {
        gradeList.forEach(grade => {
          dbService
            .classesList(grade.grade)
            .then(convertToArray)
            .then(classList => {
              this.grades.push({ ...grade, classList })

              this.setInitData()
            })
        })
      })
  }

  setClass(aclass: AClass) {
    this.currentClass = aclass
    this.classSubject$.next(this.currentClass)
  }
}
