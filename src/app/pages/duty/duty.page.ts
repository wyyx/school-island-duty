import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { IonSelect } from '@ionic/angular'
import { listAnim } from 'src/app/animations/list.anim'
import { SelectScoreModalComponent } from 'src/app/components/select-score-modal/select-score-modal.component'
import { DeductionPost, SubItemScoreHistory } from 'src/app/models/duty-db.model'
import {
  AClassVo,
  DeductionCatetoryModified,
  DeductionModified,
  GradeVo
} from 'src/app/models/duty.model'
import { PopoverService } from 'src/app/services/popover.service'
import { ToastService } from 'src/app/services/toast.service'
import { dbService } from 'src/app/storage/db.service'
import { convertToArray } from 'src/app/utils/sql.util'
import { Observable, from } from 'rxjs'
import { tap } from 'rxjs/operators'

const SIZE_PRE_SLIDE = 5

@Component({
  selector: 'app-duty',
  templateUrl: './duty.page.html',
  styleUrls: ['./duty.page.scss'],
  animations: [listAnim]
})
export class DutyPage implements OnInit, AfterViewInit {
  @ViewChild('gradeSelect') gradeSelect: IonSelect

  grades: GradeVo[] = []
  currentGrade: GradeVo = {} as GradeVo
  currentClass: AClassVo = {} as AClassVo
  gradeValue: number
  currentSubItemScoreHistoryList: SubItemScoreHistory[]

  deductionCatogoryListModified: DeductionCatetoryModified[] = []

  subItemScoreHistory$: Observable<SubItemScoreHistory[]>

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  }

  get currentClassFullName() {
    return this.currentGrade.label && this.currentClass.label
      ? this.currentGrade.label + this.currentClass.label
      : '未选班级'
  }

  constructor(private popoverService: PopoverService, private toastService: ToastService) {}

  ngAfterViewInit(): void {}

  openSelectGrade(event) {
    console.log('TCL: DutyPage -> openSelectGrade -> event', event)
    this.gradeSelect.open(event)
  }

  onGradeChange(event) {
    const grade = this.grades.filter(e => e.value === this.gradeValue)[0]
    if (grade) {
      this.currentGrade = grade
    }
  }

  ngOnInit() {
    this.loadGrades()
    this.loadDeductionCategory()

    this.getSubItemScoreHistory()
    this.subItemScoreHistory$
      .pipe(
        tap(resTap => {
          console.log('TCL: HistoryPage -> ngOnInit -> res mmmmmmm', resTap)
        })
      )
      .subscribe()
  }

  setInitData() {
    this.setFirstGrade()
    this.setFirstClass()
  }

  setFirstGrade() {
    const firstGrade = this.grades[0]

    if (firstGrade) {
      this.currentGrade = firstGrade
    }
  }

  setFirstClass() {
    this.currentClass = this.currentGrade.classes[0]
  }

  getSubItemScoreHistory() {
    this.subItemScoreHistory$ = from(dbService.subItemScoreHistory(1))
  }

  openSelectScorePopover(deductionOption: DeductionModified) {
    const popover = this.popoverService
      .openPopover({
        component: SelectScoreModalComponent,
        cssClass: 'select-score-popover',
        backdropDismiss: false
      })
      .then(res => {
        res.onDidDismiss().then(detail => {
          const score = detail.data

          // modify score
          if (score && score !== 0) {
            deductionOption.score = score
          }
        })
      })
  }

  submit(category: DeductionCatetoryModified, option: DeductionModified) {
    const data: DeductionPost = {
      autograph: '',
      checkSub: [
        {
          addressList: [],
          change_score: -option.score,
          check_sub_id: option.deductionOption.id,
          check_sub_name: option.deductionOption.rule,
          is_media: 1
        }
      ],
      check_id: category.id,
      check_name: category.category,
      class_id: this.currentClass.id
    }

    console.log('TCL: DutyPage -> submit -> data', data)

    dbService
      .saveScore(data)
      .then(() => {
        this.toastService.showToast({
          message: '您已经成功提交本次值周记录！',
          showCloseButton: true,
          closeButtonText: '关闭',
          color: 'success',
          duration: 2000
        })

        this.resetSubItem(option)
      })
      .catch(error => {
        this.toastService.showToast({
          message: '提交失败！出现意外错误，请稍后再试.',
          showCloseButton: true,
          closeButtonText: '关闭',
          color: 'danger',
          duration: 2000
        })
      })
  }

  resetSubItem(subItem: DeductionModified) {
    subItem.score = 0
    subItem.imgUrls = []
  }

  loadDeductionCategory() {
    dbService.allItemList().then(itemList => {
      this.deductionCatogoryListModified = itemList.map(item => {
        return {
          id: item.item.duty_check_item_config_id,
          category: item.item.check_name,
          deductionOptions: item.subItemArr.map(subItem => {
            return {
              score: 0,
              imgUrls: [],
              deductionOption: {
                id: subItem.duty_check_sub_item_config_id,
                label: subItem.duty_check_sub_item_config_id,
                rule: subItem.name,
                value: subItem.duty_check_sub_item_config_id
              }
            } as DeductionModified
          })
        } as DeductionCatetoryModified
      })
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
              // convert Grade to GradeVo
              this.grades.push({
                label: grade.grade,
                classes: classList.map(aClass => {
                  // convert AClass to AClassVo
                  return {
                    label: aClass.name,
                    value: aClass.class_id,
                    id: aClass.class_id
                  } as AClassVo
                }),
                value: grade.grade
              })

              this.setInitData()
            })
        })
      })
  }

  setClass(aclass: AClassVo) {
    this.currentClass = aclass
  }
}
