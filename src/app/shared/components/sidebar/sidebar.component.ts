import { Component, HostBinding, OnDestroy } from '@angular/core';
import { SideBarService } from 'src/app/services/sidebar.service';
import { Router } from '@angular/router';
import { SubAreaService } from 'src/app/services/sub-area.service';
import { Subscription } from 'rxjs';
import { KeycloakService } from 'src/app/services/keycloak.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
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
    protected subAreaService: SubAreaService,
    protected keyCloakService: KeycloakService
  ) {
    this.subscriptions.add(
      sideBarService.routes.subscribe((routes) => {
        this.routes = routes;
      })
    );

    this.subscriptions.add(
      sideBarService.toggleChange.subscribe((hide) => {
        this.hide = hide;
      })
    );
  }

  onNavigate(route) {
    switch (route) {
      case 'enter-data':
        this.subAreaService.clearAccordionCache();
        break;
      default:
        break;
    }
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getPathFromUrl(url) {
    return url.split('?')[0];
  }
}
