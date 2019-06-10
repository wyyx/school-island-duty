import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { Platform } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { dbService } from './storage/db.service'
import { AuthService } from './services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
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
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()
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
        console.log('设备已经绑定')
        this.authService.isBindingSubject$.next(true)
      })
      .catch(() => {
        this.goToBindDevicePage()
      })
  }
}
