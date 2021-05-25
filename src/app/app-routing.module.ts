import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MetricsComponent } from './metrics/metrics.component';
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
    component: ParksComponent,
  },
  {
    path: 'parks/:parkId',
    component: ParksComponent,
    data: {
      breadcrumb: 'Park Details'
    },
    // TODO: implement resolver
    children: [
    {
      path: '',
      redirectTo: 'details',
      pathMatch: 'full'
    },
    {
      path: 'details',
      redirectTo: '/',
      data: {
        breadcrumb: null,
      },
      // TODO: implement component - park details
    },
    {
      path: 'add',
      redirectTo: '/',
      data: {
        breadcrumb: 'Add Park'
      },
      // TODO: implement component - add new park
    },
    {
      path: 'edit',
      redirectTo: '/',
      data: {
        breadcrumb: 'Edit Park'
      },
      // TODO: implement component - edit existing park
    },
    {
      path: ':areaId',
      component: ParksComponent,
      data:{
        breadcrumb: 'Area Details'
      },
      // TODO: implement router for trailheads/parking lots/etc
      children: [
        {
          path: '',
          redirectTo: 'details',
          pathMatch: 'full',
        },
        {
          path: 'details',
          redirectTo: '/',
          data: {
            breadcrumb: null
          },
          // TODO: implement component - area details
        },
        {
          path: 'add',
          redirectTo: '/',
          data: {
            breadcrumb: 'Add Park Area'
          },
          // TODO: implement component - add new area
        },
        {
          path: 'edit',
          redirectTo: '/',
          data: {
            breadcrumb: 'Edit Park Area'
          },
          // TODO: implement component - edit existing area
        },
        {
          path: ':passId',
          component: ParksComponent,
          data: {
            breadcrumb: 'Pass Details'
          },
          // TODO: implement router for different passtypes
          children: [
            {
              path: '',
              redirectTo: 'details',
              pathMatch: 'full',
            },
            {
              path: 'details',
              redirectTo: '/',
              data: {
                breadcrumb: null
              },
              // TODO: implement component - pass details
            },
            {
              path: 'add',
              redirectTo: '/',
              data: {
                breadcrumb: 'Add Pass'
              },
              // TODO: implement component - add new pass
            },
            {
              path: 'edit',
              redirectTo: '/',
              data: {
                breadcrumb: 'Edit Pass'
              },
              // TODO: implement component - edit existing path
            },
          ],
        }
      ],      
    },
  ],
  },
  {
    path: 'reservations',
    data: {
      breadcrumb: "Reservations",
    },
    component: ReservationsComponent,
  },
  {
    path: 'metrics',
    data: {
      breadcrumb: "Site Metrics"
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
