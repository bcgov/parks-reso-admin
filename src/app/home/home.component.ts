import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  public isAdmin = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private keyCloakService: KeycloakService
  ) {
  }

  ngOnInit() {
    this.isAdmin = this.keyCloakService.isAuthorized(['sysadmin']);
  }

  navigate(nav) {
    this.router.navigate([nav], { relativeTo: this.route });
  }
}
