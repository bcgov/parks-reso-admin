import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { IBreadcrumb } from './breadcrumb/breadcrumb.component';
import { SideBarService } from './services/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public breadcrumbs: IBreadcrumb[];
  public activeBreadcrumb: IBreadcrumb;

  @HostBinding('class.sidebarcontrol')
  isOpen = false;

  constructor(
    private sideBarService: SideBarService,
    private router: Router,
  ) {
    this.breadcrumbs = [];
  }

  ngOnInit() {
    this.sideBarService.toggleChange.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
  }

  public navigateBreadcrumb(breadcrumbData) {
    this.router.navigate([breadcrumbData.url]);
  }
}
