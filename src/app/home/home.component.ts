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
      cardText: 'Manage parks, facilities and passes.',
      navigation: 'parks',
    },
  ];
  constructor(
    protected keyCloakService: KeycloakService,
    protected configService: ConfigService
  ) {
    if (this.configService.config.QR_CODE_ENABLED) {
      this.cardConfig.push({
        cardHeader: 'Pass Management',
        cardTitle: 'Pass Management',
        cardText: 'Check-in park guests via QR Code.',
        navigation: 'pass-management',
      });
    }

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
