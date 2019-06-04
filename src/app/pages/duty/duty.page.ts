import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { IonSelect } from '@ionic/angular'
import { listAnim } from 'src/app/animations/list.anim'
import { SelectScoreModalComponent } from 'src/app/components/select-score-modal/select-score-modal.component'
import { deductionCategoryList, grades } from 'src/app/configs/class.config'
import { AClass, DeductionCatetory } from 'src/app/models/duty.model'
import { PopoverService } from 'src/app/services/popover.service'
import { ToastService } from 'src/app/services/toast.service'

const SIZE_PRE_SLIDE = 5

@Component({
  selector: 'app-duty',
  templateUrl: './duty.page.html',
  styleUrls: ['./duty.page.scss'],
  animations: [listAnim]
})
export class DutyPage implements OnInit, AfterViewInit {
  @ViewChild('gradeSelect') gradeSelect: IonSelect

  grade: number
  grades = grades

  currentGradeName = '请选择班级'
  currentClasses: AClass[] = []

  deductionCatogoryList: DeductionCatetory[] = []

  slideOpts = {
    initialSlide: 0,
    speed: 400
  }

  constructor(private popoverService: PopoverService, private toastService: ToastService) {}

  ngAfterViewInit(): void {}

  openSelectGrade(event) {
    this.gradeSelect.open(event)
  }

  onGradeChange(event) {
    const grade = this.grades.filter(e => e.value === this.grade)[0]
    if (grade) {
      this.currentGradeName = grade.label
      this.currentClasses = grade.classes
    }
  }

  ngOnInit() {
    this.loadDeductionCategory()
  }

  openSelectScorePopover() {
    const popover = this.popoverService.openPopover({
      component: SelectScoreModalComponent,
      cssClass: 'select-score-popover',
      backdropDismiss: false
    })
  }

  submit() {
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
    this.deductionCatogoryList = deductionCategoryList
  }

  // setSlides(deductionsOptions: DeducionOption[]) {
  //   const groups = Math.ceil(this.deductionOptions.length / SIZE_PRE_SLIDE)

  //   for (let index = 0; index < groups; index++) {
  //     const slide = this.deductionOptions.slice(
  //       index * SIZE_PRE_SLIDE,
  //       index * SIZE_PRE_SLIDE + SIZE_PRE_SLIDE
  //     )

  //     this.slides.push(slide)
  //   }
  // }
}
