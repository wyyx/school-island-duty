import { Component, OnInit } from '@angular/core'
import { Grade } from 'src/app/models/duty-db.model'
import { PopoverController } from '@ionic/angular'

@Component({
  selector: 'app-select-grade-popover',
  templateUrl: './select-grade-popover.component.html',
  styleUrls: ['./select-grade-popover.component.scss']
})
export class SelectGradePopoverComponent implements OnInit {
  grades: Grade[] = []
  currentGrade: Grade

  constructor(private popoverCtrl: PopoverController) {}

  ngOnInit() {
    console.log('this.grades', this.grades)
  }

  onGradeChange(grade) {
    this.popoverCtrl.dismiss(grade)
  }
}
