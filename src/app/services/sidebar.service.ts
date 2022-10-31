import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'src/app/services/keycloak.service';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter();

  public hide = false;
  public routes: any[] = [];

  constructor(
    protected router: Router,
    protected keyCloakService: KeycloakService
  ) {
    this.routes = router.config.filter(function (obj) {
      if (obj.path === 'export-reports') {
        return keyCloakService.isAllowed('export-reports');
      } else if (obj.path === 'lock-records') {
        return keyCloakService.isAllowed('lock-records');
      } else if (obj.path === 'login') {
        return keyCloakService.isAuthenticated() ? false : true;
      } else {
        return obj.path !== '**' && obj.path !== 'unauthorized';
      }
    });
  }

  toggle() {
    this.hide = !this.hide;
    this.toggleChange.emit(this.hide);
  }

  close() {
    this.hide = true;
    this.toggleChange.emit(this.hide);
  }
}
