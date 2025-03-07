import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { NavCardComponent } from '../../shared/components/nav-card/nav-card.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-pass-management-home',
    templateUrl: './pass-management-home.component.html',
    styleUrls: ['./pass-management-home.component.scss'],
    imports: [NgFor, NavCardComponent]
})
export class PassManagementHomeComponent implements OnInit {
  public cardConfig;

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.cardConfig = [];
    if (this.configService.config.QR_CODE_ENABLED) {
      this.cardConfig.push({
        cardHeader: 'QR and Manual Check-In',
        cardTitle: 'QR and Manual Check-In',
        cardText: 'Scan passes or check in guests manually.',
        navigation: 'check-in',
        relative: true
      });

    }
    this.cardConfig.push(
      {
        cardHeader: 'Pass Search',
        cardTitle: 'Pass Search',
        cardText: 'Search, export, or cancel passes',
        navigation: 'search',
        relative: true
      },
    )
  }
}
