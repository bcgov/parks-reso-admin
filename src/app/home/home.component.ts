import { Component } from '@angular/core';
import { KeycloakService } from 'src/app/services/keycloak.service';
import { ConfigService } from '../services/config.service';

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
      cardText: 'Manage parks and facilities.',
      navigation: '/parks',
    },
  ];
  constructor(
    protected keyCloakService: KeycloakService,
    protected configService: ConfigService
  ) {
    this.cardConfig.push({
      cardHeader: 'Pass Management',
      cardTitle: 'Pass Management',
      cardText: 'Look up passes and check-in park guests via QR code.',
      navigation: '/pass-management',
    });
    if (keyCloakService.isAllowed('metrics')) {
      this.cardConfig.push({
        cardHeader: 'Site Metrics',
        cardTitle: 'Site Metrics',
        cardText: 'See pass counts for various states.',
        navigation: '/metrics',
      });
      this.cardConfig.push({
        cardHeader: 'FAQ',
        cardTitle: 'Frequently Asked Questions',
        cardText: 'View or edit the FAQ info.',
        navigation: '/faq',
      });
      
    }
  }
}
