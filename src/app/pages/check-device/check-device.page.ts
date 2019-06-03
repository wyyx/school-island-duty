import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-check-device',
  templateUrl: './check-device.page.html',
  styleUrls: ['./check-device.page.scss']
})
export class CheckDevicePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToDutyPage() {
    this.router.navigateByUrl('/tabs/duty')
  }
}
