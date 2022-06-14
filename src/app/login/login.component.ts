import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public readonly idpHintEnum = {
    BCEID: 'bceid-basic-and-business',
    BCSC: 'bcsc',
    IDIR: 'idir'
  };

  constructor(private keycloakService: KeycloakService, private router: Router) {}

  ngOnInit() {
    if (this.keycloakService.isAuthorized()) {
      this.router.navigate(['/']);
      return;
    }
    if (this.keycloakService.isAuthenticated()) {
      this.router.navigate(['/unauthorized']);
      return;
    }
  }

  handleLogin(idpHint: string) {
    sessionStorage.setItem(this.keycloakService.LAST_IDP_TRIED, idpHint);
    this.keycloakService.login(idpHint);
  }
}
