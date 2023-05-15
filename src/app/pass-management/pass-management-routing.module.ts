import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PassCheckInComponent } from './pass-check-in/pass-check-in.component';
import { PassSearchComponent } from './pass-search/pass-search.component';
import { PassManagementHomeComponent } from './pass-management-home/pass-management-home.component';

const routes: Routes = [
  {
    path: '',
    component: PassManagementHomeComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: '',
      module: 'pass-management',
      component: '',
    },
  },
  {
    path: 'check-in',
    component: PassCheckInComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Check-In',
    }
  },
  {
    path: 'search',
    component: PassSearchComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Pass Search',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassManagementRoutingModule { }
