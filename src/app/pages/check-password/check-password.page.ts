import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NavController } from '@ionic/angular'
import { NgForm, FormGroup } from '@angular/forms'
import { dbService } from 'src/app/storage/db.service'
import { ToastService } from 'src/app/services/toast.service'
import { markFormGroupAsTouched } from 'src/app/utils/form.util'

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

  onSubmit(form: FormGroup) {
    markFormGroupAsTouched(form)

    if (form.valid) {
      dbService
        .checkPassword(form.value.password)
        .then(() => {
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
