import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  {
    path: 'check-device',
    loadChildren: './pages/check-device/check-device.module#CheckDevicePageModule'
  },
  {
    path: 'check-password',
    loadChildren: './pages/check-password/check-password.module#CheckPasswordPageModule'
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
