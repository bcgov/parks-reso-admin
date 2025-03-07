import { Component } from '@angular/core';
import { SideBarService } from 'src/app/services/sidebar.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-toggle-button',
    templateUrl: './toggle-button.component.html',
    styleUrls: ['./toggle-button.component.scss'],
    imports: [NgClass]
})
export class ToggleButtonComponent {
  public loading = true;
  public closed = false;

  constructor(private sidebarService: SideBarService) {}

  toggleSideNav() {
    this.sidebarService.toggle();
    this.closed = this.sidebarService.hide;
  }
}
