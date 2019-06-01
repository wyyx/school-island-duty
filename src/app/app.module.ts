import { NgModule } from '@angular/core'
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

@NgModule({
  declarations: [
    AppComponent,
    SelectScoreModalComponent,
    ScoreSelectorComponent,
    SelectDutyModalComponent
  ],
  entryComponents: [SelectScoreModalComponent, SelectDutyModalComponent],
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
