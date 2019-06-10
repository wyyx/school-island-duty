import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TabsPage } from './tabs.page'
import { AuthGuard } from '../guards/auth.guard'

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'duty',
        loadChildren: '../pages/duty/duty.module#DutyPageModule',
        canActivate: [AuthGuard]
      },
      { path: 'history', loadChildren: '../pages/history/history.module#HistoryPageModule' },
      {
        path: '',
        redirectTo: '/tabs/duty',
        pathMatch: 'full',
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/duty',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
