import { NgModule, InjectionToken } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SelectScoreModalComponent } from './components/select-score-modal/select-score-modal.component'
import { ScoreSelectorComponent } from './components/score-selector/score-selector.component'
import { SelectDutyModalComponent } from './components/select-duty-modal/select-duty-modal.component'
import { environment } from 'src/environments/environment'
import { HttpClientModule } from '@angular/common/http'
import { IonicStorageModule } from '@ionic/storage'
import { WeekHistoryModalComponent } from './components/week-history-modal/week-history-modal.component'
import { SelectGradePopoverComponent } from './components/select-grade-popover/select-grade-popover.component'

import { Camera } from '@ionic-native/camera/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
import { FileTransfer } from '@ionic-native/file-transfer/ngx'
import { File } from '@ionic-native/file/ngx'


export const BASE_URL = new InjectionToken<string>('App base url')

@NgModule({
  declarations: [
    AppComponent,
    SelectScoreModalComponent,
    ScoreSelectorComponent,
    SelectDutyModalComponent,
    WeekHistoryModalComponent,
    SelectGradePopoverComponent
  ],
  entryComponents: [
    SelectScoreModalComponent,
    SelectDutyModalComponent,
    WeekHistoryModalComponent,
    SelectGradePopoverComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: BASE_URL, useValue: environment.base_url },
    Camera,
    File,
    FilePath,
    FileTransfer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
