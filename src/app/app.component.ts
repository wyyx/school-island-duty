import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { Platform } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { School } from './models/duty-db.model'
import { AuthService } from './services/auth.service'
import { dbService } from './storage/db.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  school = {} as School

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage: Storage,
    public authService: AuthService
  ) {
    this.initializeApp()
    dbService.initDb()
    dbService.synchronizationData()
    this.checkDeviceBinding()
    this.getSchoolInfo()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()
    })
  }

  getSchoolInfo() {
    dbService.getSchool().then(school => {
      this.school = school
    })
  }

  goToCheckPasswordPage() {
    this.router.navigateByUrl('/check-password')
  }

  goToBindDevicePage() {
    this.router.navigateByUrl('/check-device')
  }

  checkDeviceBinding() {
    dbService
      .isBinding()
      .then(() => {
        console.log('设备已绑定')
        this.authService.isBindingSubject$.next(true)
      })
      .catch(() => {
        console.log('未绑定，跳转到绑定页面')
        this.goToBindDevicePage()
      })
  }
}
