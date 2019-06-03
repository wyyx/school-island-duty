import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { listAnim } from 'src/app/animations/list.anim'
import { SelectScoreModalComponent } from 'src/app/components/select-score-modal/select-score-modal.component'
import { ModalService } from 'src/app/services/modal.service'
import { PopoverService } from 'src/app/services/popover.service'
import { range } from 'src/app/utils/number.util'
import { IonSelect } from '@ionic/angular'
import { SelectDutyModalComponent } from 'src/app/components/select-duty-modal/select-duty-modal.component'
import { ToastService } from 'src/app/services/toast.service'
import { Chip, AClass } from 'src/app/models/duty.model'
import { grades, chips } from 'src/app/configs/class.config'

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

  nullStr = ''
  nums = range(10)
  nums2 = range(5)
  nums3 = range(3)
  largeChip = true
  currentGradeName = '请选择班级'
  currentClasses: AClass[] = []

  addedChips: Chip[] = []

  chips = chips

  slideOpts = {
    initialSlide: 0,
    speed: 400
  }

  constructor(
    private modalService: ModalService,
    private popoverService: PopoverService,
    private toastService: ToastService
  ) {}

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

  isAdded(chip: Chip) {
    return this.addedChips.filter(c => c.value === chip.value).length > 0
  }

  toggleChip(chip: Chip) {
    if (this.isAdded(chip)) {
      this.addedChips = this.addedChips.filter(c => c.value !== chip.value)
    } else {
      this.addedChips.unshift(chip)
    }
  }

  toggleChipDetail() {
    this.largeChip = !this.largeChip
  }

  ngOnInit() {}

  openSelectScorePopover() {
    const popover = this.popoverService.openPopover({
      component: SelectScoreModalComponent,
      cssClass: 'select-score-popover',
      backdropDismiss: false
    })
  }

  openSelectDutyPopover() {
    const popover = this.popoverService.openPopover({
      component: SelectDutyModalComponent,
      cssClass: 'select-duty-popover',

      componentProps: {
        chips: this.chips
      },
      backdropDismiss: false
    })

    popover
      .then(res => {
        return res.onDidDismiss()
      })
      .then(popoverObj => {
        const returnedChip: Chip = popoverObj.data

        if (!returnedChip) {
          return
        }

        if (this.isAdded(returnedChip)) {
          this.toastService.showToast({
            message: '您已经添加了此值周项',
            duration: 2000,
            showCloseButton: true,
            closeButtonText: '关闭'
          })
        } else {
          this.addedChips.unshift(returnedChip)
        }
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
      .then(res => {
        this.reset()
      })
  }

  reset() {
    this.addedChips = []
  }
}
