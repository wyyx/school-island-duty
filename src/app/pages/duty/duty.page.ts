import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { listAnim } from 'src/app/animations/list.anim'
import { SelectScoreModalComponent } from 'src/app/components/select-score-modal/select-score-modal.component'
import { ModalService } from 'src/app/services/modal.service'
import { PopoverService } from 'src/app/services/popover.service'
import { range } from 'src/app/utils/number.util'
import { IonSelect } from '@ionic/angular'
import { grades, AClass } from 'src/app/configs/class.config'
import { SelectDutyModalComponent } from 'src/app/components/select-duty-modal/select-duty-modal.component'
import { ToastService } from 'src/app/services/toast.service'

interface Chip {
  label: string
  rule: string
  value: number
}

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

  chips = [
    {
      label: '第 1 项',
      rule:
        '教室持续井然，无打推、喧哗教室持续井然，无打推、喧哗教室持续井然，无打推、喧哗教室持续井然，无打推、喧哗（建议每人扣0.2）',
      value: 1
    },
    {
      label: '第 2 项',
      rule: '第2项规则，第2项规则，第2项规则，第2项规则，第2项规则，',
      value: 2
    },
    {
      label: '第 3 项',
      rule: '第3项规则，第3项规则，第3项规则，第3项规则，第3项规则，第3项规则，第3项规则，',
      value: 3
    },
    {
      label: '第 4 项',
      rule: '第4项规则，第4项规则，第4项规则，第4项规则，第4项规则，第4项规则',
      value: 4
    },
    {
      label: '第 5 项',
      rule: '第5项规则，第5项规则，第5项规则，第5项规则，第5项规则，第5项规则',
      value: 5
    },
    {
      label: '第 6 项',
      rule:
        '第6项规则，第6项规则，第6项规则，第6项规则，第6项规则，第6项规则，第6项规则，第6项规则，第6项规则，第6项规则',
      value: 6
    },
    {
      label: '第 7 项',
      rule: '第7项规则，第7项规则，第7项规则，第7项规则',
      value: 7
    },
    {
      label: '第 8 项',
      rule: '第8项规则，第8项规则，第8项规则，第8项规则，第8项规则，第8项规则',
      value: 8
    }
  ]

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

  added(chip: Chip) {
    return this.addedChips.filter(c => c.value === chip.value).length > 0
  }

  toggleChip(chip: Chip) {
    if (this.added(chip)) {
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
      backdropDismiss: true
    })
  }

  openSelectDutyPopover() {
    const popover = this.popoverService.openPopover({
      component: SelectDutyModalComponent,
      cssClass: 'select-duty-popover',
      backdropDismiss: true
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
