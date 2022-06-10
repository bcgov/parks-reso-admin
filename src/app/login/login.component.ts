import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public idirLoginUrl = '';
  public bceidLoginUrl = '';
  public bcscLoginUrl = '';

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
    this.idirLoginUrl = this.keycloakService.createLoginUrl({ idpHint: 'idir' });
    this.bceidLoginUrl = this.keycloakService.createLoginUrl({ idpHint: 'bceid-basic-and-business' });
    this.bcscLoginUrl = this.keycloakService.createLoginUrl({ idpHint: 'bcsc' });
  }
}
