import { Routes } from '@angular/router';
import { FacilityAddComponent } from './facility-add/facility-add.component';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
import { FacilityListComponent } from './facility-list/facility-list.component';

export const FacilitiesRoutes: Routes = [
  {
    path: '',
    component: FacilityListComponent,
  },
  {
    path: ':facilityId',
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full'
      },
      {
        path: 'details',
        component: FacilityDetailsComponent
      },
      {
        path: 'add',
        component: FacilityAddComponent
      },
      {
        path: 'edit',
        component: FacilityEditComponent
      }
    ]
  }
];
