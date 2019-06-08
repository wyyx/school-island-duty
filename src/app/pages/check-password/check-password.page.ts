import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NavController } from '@ionic/angular'
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-check-password',
  templateUrl: './check-password.page.html',
  styleUrls: ['./check-password.page.scss']
})
export class CheckPasswordPage implements OnInit {
  constructor(private router: Router, private navCtl: NavController) {}

  ngOnInit() {}

  back() {
    this.navCtl.back()
  }

  onSubmit(form: NgForm) {
    console.log('TCL: CheckPasswordPage -> onSubmit -> form', form)
    if (form.valid) {
      this.router.navigateByUrl('/check-device')
    }
  }
}
