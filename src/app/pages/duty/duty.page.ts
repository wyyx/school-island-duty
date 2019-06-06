import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { IonSelect } from '@ionic/angular'
import { listAnim } from 'src/app/animations/list.anim'
import { SelectScoreModalComponent } from 'src/app/components/select-score-modal/select-score-modal.component'
import { deductionCategoryList, grades } from 'src/app/configs/class.config'
import {
  AClassVo,
  DeductionCatetoryModified,
  DeductionModified,
  GradeVo
} from 'src/app/models/duty.model'
import { PopoverService } from 'src/app/services/popover.service'
import { ToastService } from 'src/app/services/toast.service'
import { cloneDeep } from 'lodash'
import { dbService } from 'src/app/storage/db.service'
import { convertToArray } from 'src/app/utils/sql.util'

const SIZE_PRE_SLIDE = 5

@Component({
  selector: 'app-duty',
  templateUrl: './duty.page.html',
  styleUrls: ['./duty.page.scss'],
  animations: [listAnim]
})
export class DutyPage implements OnInit, AfterViewInit {
  @ViewChild('gradeSelect') gradeSelect: IonSelect

  grades = grades
  currentGrade: GradeVo = {} as GradeVo
  currentClass: AClassVo = {} as AClassVo
  gradeValue: number

  deductionCatogoryListModified: DeductionCatetoryModified[] = []

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
    this.loadDeductionCategory()
    this.loadGrades()
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

  submit(option: DeductionModified) {
    option.score = 0

    this.toastService
      .showToast({
        message: '您已经成功提交本次值周记录！',
        showCloseButton: true,
        closeButtonText: '关闭',
        color: 'success',
        duration: 2000
      })
      .then(res => {})
  }

  loadDeductionCategory() {
    this.deductionCatogoryListModified = deductionCategoryList.map(category => {
      return {
        ...category,
        deductionOptions: category.deductionOptions.map(
          option => ({ score: 0, imgUrls: [], deductionOption: option } as DeductionModified)
        )
      }
    })
  }

  loadGrades() {
    const gradesTemp: GradeVo[] = []

    dbService
      .gradeList()
      .then(convertToArray)
      .then(gradeList => {
        console.log('TCL: DutyPage -> loadGrades -> gradeList', gradeList)

        gradeList.forEach(grade => {
          dbService
            .classesList(grade.grade)
            .then(convertToArray)
            .then(classList => {
              console.log('TCL: DutyPage -> loadGrades -> classList', classList)

              gradesTemp.push({
                label: grade.grade,
                classes: classList.map(aClass => {
                  return {
                    label: aClass.name,
                    value: aClass.class_id
                  } as AClassVo
                }),
                value: grade.id
              })

              this.grades = gradesTemp
              this.setInitData()
            })
        })
      })
  }

  setClass(aclass: AClassVo) {
    this.currentClass = aclass
  }
}
