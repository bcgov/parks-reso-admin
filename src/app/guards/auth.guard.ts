import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { KeycloakService } from 'app/services/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private readonly keycloakService: KeycloakService, private readonly router: Router) {}

  canActivate(): boolean | UrlTree {
    const idpTried = sessionStorage.getItem(this.keycloakService.LAST_IDP_TRIED);
    const idpThatWorked = sessionStorage.getItem(this.keycloakService.LAST_IDP_AUTHENTICATED);

    if (!this.keycloakService.isAuthenticated()) {
      if (!idpThatWorked) {
        return this.router.parseUrl('/login');
      }
      this.keycloakService.login(idpThatWorked);
      return false;
    }

    if (!this.keycloakService.isAuthorized()) {
      return this.router.parseUrl('/unauthorized');
    }

    if (idpTried !== idpThatWorked) {
      sessionStorage.setItem(this.keycloakService.LAST_IDP_AUTHENTICATED, idpTried);
    }

    return true;
  }
}
