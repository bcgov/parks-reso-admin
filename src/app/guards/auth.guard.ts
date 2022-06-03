import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { KeycloakService } from 'app/services/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly keycloakService: KeycloakService, private readonly router: Router) {}

  canActivate(): boolean | UrlTree {
    if (!this.keycloakService.isAuthenticated()) {
      if (!this.keycloakService.triedAutoLogin) {
        this.keycloakService.tryAutoLogin();
        return false;
      }
      return this.router.parseUrl('/login');
    }

    if (!this.keycloakService.isAuthorized()) {
      return this.router.parseUrl('/unauthorized');
    }

    return true;
  }
}
