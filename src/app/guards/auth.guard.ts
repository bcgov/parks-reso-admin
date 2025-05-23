import { Injectable } from '@angular/core';
import { UrlTree, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { KeycloakService } from '../services/keycloak.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly router: Router,
    private readonly configService: ConfigService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // When a successful login occurs, we store the identity provider used in localStorage.
    const lastIdp = localStorage.getItem(
      this.keycloakService.LAST_IDP_AUTHENTICATED
    );

    // Not authenticated
    if (!this.keycloakService.isAuthenticated()) {
      // remove the localStorage value first, so if this authentication attempt
      // fails then the user will get the login page next time.
      localStorage.removeItem(this.keycloakService.LAST_IDP_AUTHENTICATED);
      localStorage.setItem(this.configService.config.REDIRECT_KEY, window.location.href)

      if (lastIdp === null) {
        // If an identity provider hasn't been selected then show the login page.
        return this.router.parseUrl('/login');
      }
      // If an identity provider was already selected and successfully authenticated
      // then do a keycloak login with that identity provider.
      this.keycloakService.login(lastIdp);
      return false;
    } else {
      localStorage.removeItem(this.configService.config.REDIRECT_KEY)
    }

    // Not authorized / feature flagged
    if (!this.keycloakService.isAuthorized()) {
      // login was successful but the user doesn't have necessary Keycloak roles.
      return this.router.parseUrl('/unauthorized');
    }

    if (
      !this.configService.config.QR_CODE_ENABLED &&
      state.url === '/pass-management'
    ) {
      return this.router.parseUrl('/');
    }

    if (
      !this.keycloakService.isAllowed('export-reports') &&
      state.url === '/export-reports'
    ) {
      return this.router.parseUrl('/');
    }

    if (
      !this.keycloakService.isAllowed('lock-records') &&
      state.url === '/lock-records'
    ) {
      return this.router.parseUrl('/');
    }

    if (!this.keycloakService.isAllowed('faq') && state.url === '/faq') {
      return this.router.parseUrl('/unauthorized');
    }
    // Show the requested page.
    return true;
  }
}
