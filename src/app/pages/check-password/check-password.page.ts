import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NavController } from '@ionic/angular'
import { NgForm } from '@angular/forms'
import { dbService } from 'src/app/storage/db.service'
import { ToastService } from 'src/app/services/toast.service'

@Component({
  selector: 'app-check-password',
  templateUrl: './check-password.page.html',
  styleUrls: ['./check-password.page.scss']
})
export class CheckPasswordPage implements OnInit {
  constructor(
    private router: Router,
    private navCtl: NavController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  back() {
    this.navCtl.back()
  }

  onSubmit(form: NgForm) {
    console.log('TCL: CheckPasswordPage -> onSubmit -> form', form)
    if (form.valid) {
      console.log('TCL: CheckPasswordPage -> onSubmit -> form.valid', form.valid)
      console.log('TCL: CheckPasswordPage -> onSubmit -> form.value.password', form.value.password)

      dbService
        .checkPassword(form.value.password)
        .then(() => {
          console.log('xxxxxxxxxxxxxxxx')
          this.router.navigateByUrl('/check-device')
        })
        .catch(err => {
          this.toastService.showToast({
            message: '密码不正确',
            color: 'danger'
          })
        })
    }
  }
}
