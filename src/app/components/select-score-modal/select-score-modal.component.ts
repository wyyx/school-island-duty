import { Component, OnInit } from '@angular/core'
import { PopoverService } from 'src/app/services/popover.service'

@Component({
  selector: 'app-select-score-modal',
  templateUrl: './select-score-modal.component.html',
  styleUrls: ['./select-score-modal.component.scss']
})
export class SelectScoreModalComponent implements OnInit {
  sum = 0
  constructor(private popoverService: PopoverService) {}

  ngOnInit() {}

  cancel() {
    this.popoverService.close()
  }

  ok() {
    this.popoverService.close(this.sum)
  }

  onScoreChange(event) {
    console.log('TCL: SelectScoreModalComponent -> ok -> event', event)
  }
}
