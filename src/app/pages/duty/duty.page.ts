import { Component, OnInit } from '@angular/core'
import { ModalService } from 'src/app/services/modal.service'
import { range } from 'src/app/utils/number.util'
import { SelectScoreModalComponent } from 'src/app/components/select-score-modal/select-score-modal.component'
import { PopoverController } from '@ionic/angular'
import { PopoverService } from 'src/app/services/popover.service'

@Component({
  selector: 'app-duty',
  templateUrl: './duty.page.html',
  styleUrls: ['./duty.page.scss']
})
export class DutyPage implements OnInit {
  grade = '选择年级'
  nullStr = ''
  nums = range(10)
  nums2 = range(5)
  nums3 = range(3)

  slideOpts = {
    initialSlide: 0,
    speed: 400
  }

  constructor(private modalService: ModalService, private popoverService: PopoverService) {}

  ngOnInit() {}

  openSelectScoreModal() {
    const modalRef = this.modalService.openModal({
      component: SelectScoreModalComponent
    })
  }

  openSelectScorePopover() {
    const popoverRef = this.popoverService.openPopover({
      component: SelectScoreModalComponent
      // backdropDismiss: false
    })
  }
}
