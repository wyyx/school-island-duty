import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-score-selector',
  templateUrl: './score-selector.component.html',
  styleUrls: ['./score-selector.component.scss']
})
export class ScoreSelectorComponent implements OnInit {
  @Output() scoreChange = new EventEmitter<number>()

  integerNums = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
  decimalNums = [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6], [0.7, 0.8, 0.9]]

  selectedInteger = 0
  selectedDecimal = 0

  sum = 0

  constructor() {}

  ngOnInit() {}

  setIntegerPart(num: number) {
    this.toggleIntegerSelect(num)
    this.caculateSum()
  }

  toggleIntegerSelect(num: number) {
    if (this.selectedInteger === num) {
      this.selectedInteger = 0
    } else {
      this.selectedInteger = num
    }
  }

  getIfIntegerSelected(num: number) {
    return this.selectedInteger === num
  }

  setDecimalPart(num: number) {
    this.toggleDecimalSelect(num)
    this.caculateSum()
  }

  toggleDecimalSelect(num: number) {
    if (this.selectedDecimal === num) {
      this.selectedDecimal = 0
    } else {
      this.selectedDecimal = num
    }
  }

  getIfDecimalSelected(num: number) {
    return this.selectedDecimal === num
  }

  caculateSum() {
    const temp = this.sum

    this.sum = this.selectedInteger + this.selectedDecimal

    if (temp !== this.sum) {
      this.scoreChange.emit(this.sum)
    }
  }

  onChange() {
    this.scoreChange.emit(this.sum)
    console.log('TCL: ScoreSelectorComponent -> onChange -> this.sum', this.sum)
  }

  onFocus() {
    // const sum = this.sum

    this.selectedInteger = 0
    this.selectedDecimal = 0

    // this.sum
  }
}
