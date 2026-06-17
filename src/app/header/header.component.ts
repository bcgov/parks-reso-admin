import { Component, Input, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { KeycloakService } from '../services/keycloak.service';
import { SideBarService } from '../services/sidebar.service';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
    RouterLink,
    NgbCollapse,
    NgClass
]
})
export class HeaderComponent implements OnDestroy {
  protected configService = inject(ConfigService);
  protected sidebarService = inject(SideBarService);
  protected keycloakService = inject(KeycloakService);

  @Input() showSideBar = true;

  private subscriptions = new Subscription();

  public envName: string;
  public showBanner = true;
  public welcomeMsg: String;
  public isAuthorized: boolean;
  public isMenuCollapsed = true;
  public routes: any[] = [];

  constructor() {
    const sidebarService = this.sidebarService;

    this.subscriptions.add(
      sidebarService.routes.subscribe((routes) => {
        this.routes = routes;
      })
    );

    this.isAuthorized = this.keycloakService.isAuthorized();
    this.welcomeMsg = this.keycloakService.getWelcomeMessage();

    this.envName = this.configService.config['ENVIRONMENT'];
    if (this.envName === 'prod') {
      this.showBanner = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
