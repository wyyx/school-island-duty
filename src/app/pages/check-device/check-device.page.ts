import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-check-device',
  templateUrl: './check-device.page.html',
  styleUrls: ['./check-device.page.scss']
})
export class CheckDevicePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onSumit(form: NgForm) {
    console.log('TCL: CheckDevicePage -> onSumit -> form', form)
    if (form.valid) {
      this.goToDutyPage()
    }
  }

  goToDutyPage() {
    this.router.navigateByUrl('/tabs/duty')
  }
}
