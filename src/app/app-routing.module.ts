import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './home/home.component';
import { MetricsComponent } from './metrics/metrics.component';
import { ReservationsComponent } from './reservations/reservations.component';

// Routes
import { ParksRoutes } from './parks/parks-routes';
import { ParksComponent } from './parks/parks.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'parks',
    component: ParksComponent,
    data: {
      breadcrumb: 'Parks',
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
                data: {
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
    component: ReservationsComponent,
    data: {
      breadcrumb: 'Reservations',
    },
  },
  {
    path: 'metrics',
    component: MetricsComponent,
    data: {
      breadcrumb: 'Site Metrics'
    },
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
