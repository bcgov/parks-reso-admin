import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PassManagementComponent } from './pass-management.component';

const routes: Routes = [
  {
    path: '',
    component: PassManagementComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: '',
      module: 'pass-managment',
      component: '',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassManagementRoutingModule {}
