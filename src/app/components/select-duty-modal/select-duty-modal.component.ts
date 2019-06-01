import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-select-duty-modal',
  templateUrl: './select-duty-modal.component.html',
  styleUrls: ['./select-duty-modal.component.scss']
})
export class SelectDutyModalComponent implements OnInit {
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

  constructor() {}

  ngOnInit() {}
}
