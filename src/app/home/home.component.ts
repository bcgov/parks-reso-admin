import { Component } from '@angular/core';
import { KeycloakService } from 'src/app/services/keycloak.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // This can be pulled in via the config.
  public cardConfig = [
    {
      cardHeader: 'Parks Management',
      cardTitle: 'Parks Management',
      cardText: 'Manage parks, facilities and passes.',
      navigation: 'parks',
    },
  ];
  constructor(protected keyCloakService: KeycloakService) {
    // if (keyCloakService.isAllowed('export-reports')) {
    //   this.cardConfig.push({
    //     cardHeader: 'Pass Management',
    //     cardTitle: 'Pass Management Tools',
    //     cardText: 'This page is a work in progress. Coming soon.',
    //     navigation: 'export-reports',
    //   });
    // }
    if (keyCloakService.isAllowed('metrics')) {
      this.cardConfig.push({
        cardHeader: 'Site Metrics',
        cardTitle: 'Site Metrics',
        cardText: 'See pass counts for various states.',
        navigation: 'metrics',
      });
    }
  }
}
