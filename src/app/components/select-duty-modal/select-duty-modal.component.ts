import { Component, OnInit } from '@angular/core'
import { Chip } from 'src/app/models/duty.model'
import { PopoverService } from 'src/app/services/popover.service'

@Component({
  selector: 'app-select-duty-modal',
  templateUrl: './select-duty-modal.component.html',
  styleUrls: ['./select-duty-modal.component.scss']
})
export class SelectDutyModalComponent implements OnInit {
  chips
  currentSelect
  selectedChip: Chip

  constructor(private popoverService: PopoverService) {}

  ngOnInit() {}

  onRadioChange(event: CustomEvent) {
    this.currentSelect = event.detail.value
  }

  ok() {
    this.popoverService.close(this.selectedChip)
  }

  cancel() {
    this.popoverService.close()
  }

  select(chip: Chip) {
    this.selectedChip = chip
  }
}
