import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from 'app/confirm/confirm.component';

import { Subject } from 'rxjs/Subject';
import { ApiService } from 'app/services/api.service';
import { KeycloakService } from 'app/services/keycloak.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('toggleNav', [
      state('navClosed', style({
        height: '0',
      })),
      state('navOpen', style({
        height: '*',
      })),
      transition('navOpen => navClosed', [
        animate('0.2s')
      ]),
      transition('navClosed => navOpen', [
        animate('0.2s')
      ]),
    ]),
  ]
})

export class HeaderComponent implements OnInit, OnDestroy {
  @Input() showSideBar = true;

  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  public isNavMenuOpen = false;
  public welcomeMsg: String;
  public isAuthorized: boolean;
  public environment: string;

  constructor(
    private dialogService: DialogService,
    public router: Router,
    private apiService: ApiService,
    private keycloakService: KeycloakService,
  ) {
    router.events.subscribe(() => {
      this.isAuthorized = this.keycloakService.isAuthorized();
      this.welcomeMsg = this.apiService.getWelcomeMessage();
    });

    this.environment = this.apiService.getEnvironment();
  }

  ngOnInit() {
    let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    if (isIEOrEdge) {
      this.dialogService.addDialog(ConfirmComponent,
        {
          title: 'Browser Incompatible',
          message: '<strong>  Attention: </strong>This website is not supported by Internet Explorer and Microsoft Edge, please use Google Chrome or Firefox.',
          okOnly: true,
        }, {
        backdropColor: 'rgba(0, 0, 0, 0.5)'
      });
    }
  }

  toggleNav() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

  closeNav() {
    this.isNavMenuOpen = false;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
