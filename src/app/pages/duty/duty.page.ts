import { Component, OnInit } from '@angular/core'
import { ModalService } from 'src/app/services/modal.service'
import { range } from 'src/app/utils/number.util'
import { SelectScoreModalComponent } from 'src/app/components/select-score-modal/select-score-modal.component'

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

  slideOpts = {
    initialSlide: 0,
    speed: 400
  }

  constructor(private modalService: ModalService) {}

  ngOnInit() {}

  openSelectScoreModal() {
    console.log('xxxxxxxxxxx')
    const modalRef = this.modalService.openModal(SelectScoreModalComponent, false)
  }
}
