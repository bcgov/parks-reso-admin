import { Component, Input } from '@angular/core';
import { SideBarService } from 'app/services/sidebar.service';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss']
})
export class ToggleButtonComponent {
  @Input() disabled = false;

  public loading = true;
  public classApplied = false;

  constructor(private sidebarService: SideBarService) {}

  toggleSideNav() {
    if (!this.disabled) {
      this.sidebarService.toggle();
      this.classApplied = !this.classApplied;
    }
  }
}
