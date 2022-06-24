import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Params } from '@angular/router';
import { KeycloakService } from 'app/services/keycloak.service';
import { filter } from 'rxjs/operators';

export interface IBreadcrumb {
  label: string;
  params: Params;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Output() navigateBreadcrumb: EventEmitter<any> = new EventEmitter();

  public breadcrumbs: IBreadcrumb[];
  public activeBreadcrumb: IBreadcrumb;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private keycloakService: KeycloakService
  ) {
    this.breadcrumbs = [];
  }

  public ngOnInit() {
    // Subscribe to the NavigationEnd event
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      // Set breadcrumbs
      const root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
      this.activeBreadcrumb = this.breadcrumbs.pop();
    });
  }

  /**
   * Returns array of IBreadcrumb objects that represent the breadcrumb
   *
   * @class BreadcrumbComponent
   * @method getBreadcrumbs
   * @param {ActivateRoute} route
   * @param {string} url
   * @param {IBreadcrumb[]} breadcrumbs
   */
  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

    // get the child routes
    const children: ActivatedRoute[] = route.children;

    // return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    // iterate over each children
    for (const child of children) {
      // verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      // verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      // skip if breadcrumb data is null
      if (!child.snapshot.data[ROUTE_DATA_BREADCRUMB]) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      if (child.snapshot.data[ROUTE_DATA_BREADCRUMB] === 'PARK NAME') {
        const detail = child.snapshot.data;
        if (detail.park && detail.park.name) {
          child.snapshot.data[ROUTE_DATA_BREADCRUMB] = detail.park.name;
        }
      }

      if (child.snapshot.data[ROUTE_DATA_BREADCRUMB] === 'FACILITY NAME') {
        const detail = child.snapshot.data;
        if (detail.facility && detail.facility.name) {
          child.snapshot.data[ROUTE_DATA_BREADCRUMB] = detail.facility.name;
        }
      }

      if (child.snapshot.data[ROUTE_DATA_BREADCRUMB] === 'REGISTRATION NUMBER') {
        const detail = child.snapshot.data;
        if (detail.pass && detail.pass.registrationNumber) {
          child.snapshot.data[ROUTE_DATA_BREADCRUMB] = detail.pass.registrationNumber;
        }
      }

      // get the route's URL segment
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

      // append route URL to URL
      url += `/${routeURL}`;

      // add breadcrumb
      const breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      breadcrumbs.push(breadcrumb);

      // recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
  }

  public emitBreadcrumb(url, params) {
    this.navigateBreadcrumb.emit({
      url: url,
      params: params
    });
  }

  public isAuthorized() {
    return this.keycloakService.isAuthorized();
  }
}
