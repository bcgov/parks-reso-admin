import { Component, HostBinding, OnDestroy } from '@angular/core';
import { SideBarService } from 'src/app/services/sidebar.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KeycloakService } from 'src/app/services/keycloak.service';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: true,
    imports: [
        NgClass,
        NgFor,
        NgIf,
    ],
})
export class SidebarComponent implements OnDestroy {
  @HostBinding('class.is-toggled')
  public hide = false;

  public routes: any[] = [];
  public currentRoute: any;

  private subscriptions = new Subscription();

  constructor(
    protected sideBarService: SideBarService,
    protected router: Router,
    protected keyCloakService: KeycloakService
  ) {
    this.subscriptions.add(
      sideBarService.routes.subscribe((routes) => {
        // Peel out the non-active routes.
        let displayedRoutes = [];
        for(let r of routes) {
          if (r.data.sidebar === true) {
            displayedRoutes.push(r);
          }
        }
        this.routes = displayedRoutes;
      })
    );

    this.subscriptions.add(
      sideBarService.toggleChange.subscribe((hide) => {
        this.hide = hide;
      })
    );
  }

  onNavigate(route) {
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getPathFromUrl(url) {
    return url.split('?')[0];
  }
}
