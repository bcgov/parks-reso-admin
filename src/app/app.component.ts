import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IBreadcrumb } from './breadcrumb/breadcrumb.component';
import { SideBarService } from './services/sidebar.service';
import { ToastService } from './services/toast.service';
import { Constants } from './shared/utils/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

  public breadcrumbs: IBreadcrumb[];
  public activeBreadcrumb: IBreadcrumb;

  @HostBinding('class.sidebarcontrol')
  isOpen = false;
  showSideBar = false;
  showBreadCrumb = false;
  toastSubscription: Subscription;

  constructor(
    private sideBarService: SideBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private toastService: ToastService
  ) {
    this.breadcrumbs = [];
  }



  ngOnInit() {
    this.sideBarService.toggleChange.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
    this.watchForToast();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSideBar = this.activatedRoute.firstChild.snapshot.data.showSideBar !== false;
        this.showBreadCrumb = this.activatedRoute.firstChild.snapshot.data.showBreadCrumb !== false;
      }
    });
  }

  private watchForToast() {
    // tslint:disable-next-statement
    const self = this;
    this.toastSubscription = this.toastService.messages.subscribe(messages => {
      messages.forEach(msg => {
        switch (msg.type) {
          case Constants.ToastTypes.SUCCESS: {
            this.toastr.success(msg.body, msg.title);
          } break;
          case Constants.ToastTypes.WARNING: {
            this.toastr.warning(msg.body, msg.title);
          } break;
          case Constants.ToastTypes.INFO: {
            this.toastr.info(msg.body, msg.title);
          } break;
          case Constants.ToastTypes.ERROR: {
            this.toastr.error(
              msg.body,
              msg.title,
              {
                extendedTimeOut: 0,
                timeOut: 0,
                closeButton: true
              }
            );
          } break;
        }
        // Remove message from memory
        self.toastService.removeMessage(msg.guid);
      });
    });
  }

  public navigateBreadcrumb(breadcrumbData) {
    this.router.navigate([breadcrumbData.url]);
  }

  ngOnDestroy() {
    this.toastSubscription.unsubscribe();
  }
}
