import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MetricsComponent } from './metrics/metrics.component';
import { ParksAddComponent } from './parks/parks-add/parks-add.component';
import { ParksDetailComponent } from './parks/parks-detail/parks-detail.component';
import { ParksEditComponent } from './parks/parks-edit/parks-edit.component';
import { ParksFeatureAddComponent } from './parks/parks-feature/parks-feature-add/parks-feature-add.component';
import { ParksFeatureEditComponent } from './parks/parks-feature/parks-feature-edit/parks-feature-edit.component';
import { ParksFeatureComponent } from './parks/parks-feature/parks-feature.component';
import { ParksComponent } from './parks/parks.component';
import { ReservationsComponent } from './reservations/reservations.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'parks',
    data: {
      breadcrumb: 'All Parks',
    },
    children: [
      {
        path: '',
        component: ParksComponent,
        data: {
          breadcrumb: null,
        },
      },
      {
        path: 'add-park',
        component: ParksAddComponent,
        data: {
          breadcrumb: 'Add New Park',
        }
      },
      {
        path: ':parkId',
        // TODO: implement resolver
        data: {
          breadcrumb: 'Park Details',
        },
        children: [
          {
            path: '',
            redirectTo: 'details',
            data: {
              breadcrumb: null,
            },
            pathMatch: 'full',
          },
          {
            path: 'edit',
            component: ParksEditComponent,
            data: {
              breadcrumb: 'Edit Park'
            },
          },
          {
            path: 'add-feature',
            component: ParksFeatureAddComponent,
            data: {
              breadcrumb: 'Add Park Feature'
            },
          },
          {
            path: 'details',
            component: ParksDetailComponent,
            data: {
              breadcrumb: null,
            },
          },
          {
            path: 'details/:featureId',
            data: {
              breadcrumb: 'Park Feature Details',
            },
            children: [
              {
                path: '',
                redirectTo: 'details',
                data:{
                  breadcrumb: null,
                },
                pathMatch: 'full',
              },
              {
                path: 'details',
                component: ParksFeatureComponent,
                data: {
                  breadcrumb: null,
                },
              },
              {
                path: 'edit',
                component: ParksFeatureEditComponent,
                data: {
                  breadcrumb: 'Edit Park Feature',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'reservations',
    data: {
      breadcrumb: 'Reservations',
    },
    component: ReservationsComponent,
  },
  {
    path: 'metrics',
    data: {
      breadcrumb: 'Site Metrics'
    },
    component: MetricsComponent,
  },
  {
    // wildcard route
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})

export class AppRoutingModule { }
