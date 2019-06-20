import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/services/auth.service'
import { ToastService } from 'src/app/services/toast.service'
import { dbService } from 'src/app/storage/db.service'
import { AlertService } from 'src/app/services/alert.service'
import { LoadingService } from 'src/app/services/loading.service'

@Component({
  selector: 'app-check-device',
  templateUrl: './check-device.page.html',
  styleUrls: ['./check-device.page.scss']
})
export class CheckDevicePage implements OnInit {
  form: FormGroup
  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      deviceId: ['', Validators.required],
      devicePassword: ['', Validators.required]
    })
  }

  ionViewWillEnter() {
    this.resetFormData()
  }

  resetFormData() {
    this.form.reset()
  }

  onSubmit() {
    if (this.form.valid) {
      dbService
        .isBinding()
        // rebinding
        .then(() => {
          console.log('rebinding')
          this.alertService.showAlert({
            message: '重新绑定会删除当前设备上的所有数据，您确定要继续吗？',
            buttons: [
              {
                text: '取消',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {}
              },
              {
                text: '确定',
                handler: () => {
                  dbService.DropTable()
                  this.bindDevice()
                }
              }
            ]
          })
        })
        // first binding
        .catch(() => {
          this.bindDevice()
        })
    }
  }

  bindDevice() {
    const loadingRef = this.loadingService.openLoading({
      message: '正在绑定...'
    })

    dbService
      .binding(this.form.value.deviceId, this.form.value.devicePassword)
      .then(() => {
        this.authService.isBindingSubject$.next(true)
        dbService.synchronizationData()

        loadingRef.then(loading => {
          loading.dismiss()
        })

        this.goToDutyPage()
      })
      .catch(err => {
        loadingRef.then(loading => {
          loading.dismiss()
        })

        this.toastService.showToast({
          message: '绑定失败，请检查设备ID和密码！',
          color: 'danger'
        })
      })
      .finally(() => {
        loadingRef.then(loading => {
          loading.dismiss()
        })
      })
  }

  goToDutyPage() {
    this.router.navigateByUrl('/tabs/duty')
  }
}
