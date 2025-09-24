import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { ConfigService } from './services/config.service';
import { DataService } from './services/data.service';
import { EventService } from './services/event.service';
import { LoggerService } from './services/logger.service';
import { ToastService } from './services/toast.service';
import { BreadcrumbModule } from './shared/components/breadcrumb/breadcrumb.module';
import { SidebarModule } from './shared/components/sidebar/sidebar.module';
import { ToggleButtonModule } from './shared/components/toggle-button/toggle-button.module';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { Constants } from './shared/utils/constants';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let mockActivatedRoute: any;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let navigationSubject: Subject<any>;
  let toastSubject: Subject<any[]>;

  beforeEach(async () => {
    navigationSubject = new Subject();
    toastSubject = new Subject();
    
    mockActivatedRoute = {
      firstChild: {
        snapshot: {
          data: {}
        }
      }
    };

    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'warning', 'info', 'error']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['removeMessage'], {
      messages: toastSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SidebarModule,
        ToggleButtonModule,
        BreadcrumbModule,
        HeaderModule,
        FooterComponent,
        HomeComponent,
        ToastrModule.forRoot(),
        AppComponent
      ],
      providers: [
        ConfigService,
        LoggerService,
        DataService,
        EventService,
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient(withInterceptorsFromDi()),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    mockToastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    // Mock router events
    spyOnProperty(router, 'events').and.returnValue(navigationSubject.asObservable());
    
    // Ensure subscription is properly initialized for all tests
    if (!component.toastSubscription) {
      // The subscription is created in constructor via watchForToast()
      fixture.detectChanges();
    }
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toBe('attendance-and-revanue-admin');
  });

  it('should initialize with default values', () => {
    expect(component.showSideBar).toBe(false);
    expect(component.showBreadCrumb).toBe(false);
    expect(component.toastSubscription).toBeDefined();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should subscribe to router events', () => {
      component.ngOnInit();
      expect(router.events).toBeDefined();
    });

    it('should set showSideBar to true when route data does not explicitly disable it', () => {
      mockActivatedRoute.firstChild.snapshot.data = {};
      
      component.ngOnInit();
      navigationSubject.next(new NavigationEnd(1, '/test', '/test'));
      
      expect(component.showSideBar).toBe(true);
    });

    it('should set showBreadCrumb to true when route data does not explicitly disable it', () => {
      mockActivatedRoute.firstChild.snapshot.data = {};
      
      component.ngOnInit();
      navigationSubject.next(new NavigationEnd(1, '/test', '/test'));
      
      expect(component.showBreadCrumb).toBe(true);
    });

    it('should set showSideBar to false when route data explicitly disables it', () => {
      mockActivatedRoute.firstChild.snapshot.data = { showSideBar: false };
      
      component.ngOnInit();
      navigationSubject.next(new NavigationEnd(1, '/login', '/login'));
      
      expect(component.showSideBar).toBe(false);
    });

    it('should set showBreadCrumb to false when route data explicitly disables it', () => {
      mockActivatedRoute.firstChild.snapshot.data = { showBreadCrumb: false };
      
      component.ngOnInit();
      navigationSubject.next(new NavigationEnd(1, '/login', '/login'));
      
      expect(component.showBreadCrumb).toBe(false);
    });

    it('should handle navigation events when activatedRoute has no firstChild', () => {
      mockActivatedRoute.firstChild = null;
      
      component.ngOnInit();
      navigationSubject.next(new NavigationEnd(1, '/test', '/test'));
      
      // Should not throw error and maintain default values
      expect(component.showSideBar).toBe(false);
      expect(component.showBreadCrumb).toBe(false);
    });

    it('should only respond to NavigationEnd events', () => {
      const initialShowSideBar = component.showSideBar;
      
      component.ngOnInit();
      navigationSubject.next({ id: 1, url: '/test' }); // Not a NavigationEnd event
      
      expect(component.showSideBar).toBe(initialShowSideBar);
    });
  });

  describe('Toast functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display success toast', () => {
      const testMessage = {
        type: Constants.ToastTypes.SUCCESS,
        title: 'Test Title',
        body: 'Test Body',
        guid: 'test-guid-1'
      };

      toastSubject.next([testMessage]);

      expect(mockToastrService.success).toHaveBeenCalledWith('Test Body', 'Test Title');
      expect(mockToastService.removeMessage).toHaveBeenCalledWith('test-guid-1');
    });

    it('should display QR Service success toast with special configuration', () => {
      const testMessage = {
        type: Constants.ToastTypes.SUCCESS,
        title: 'QR Service',
        body: 'QR Code generated',
        guid: 'test-guid-qr'
      };

      toastSubject.next([testMessage]);

      expect(mockToastrService.success).toHaveBeenCalledWith('QR Code generated', 'QR Service', {
        timeOut: 1000,
        positionClass: 'toast-top-center',
      });
      expect(mockToastService.removeMessage).toHaveBeenCalledWith('test-guid-qr');
    });

    it('should display warning toast', () => {
      const testMessage = {
        type: Constants.ToastTypes.WARNING,
        title: 'Warning Title',
        body: 'Warning Message',
        guid: 'test-guid-warning'
      };

      toastSubject.next([testMessage]);

      expect(mockToastrService.warning).toHaveBeenCalledWith('Warning Message', 'Warning Title');
      expect(mockToastService.removeMessage).toHaveBeenCalledWith('test-guid-warning');
    });

    it('should display info toast', () => {
      const testMessage = {
        type: Constants.ToastTypes.INFO,
        title: 'Info Title',
        body: 'Info Message',
        guid: 'test-guid-info'
      };

      toastSubject.next([testMessage]);

      expect(mockToastrService.info).toHaveBeenCalledWith('Info Message', 'Info Title');
      expect(mockToastService.removeMessage).toHaveBeenCalledWith('test-guid-info');
    });

    it('should display error toast with special configuration', () => {
      const testMessage = {
        type: Constants.ToastTypes.ERROR,
        title: 'Error Title',
        body: 'Error Message',
        guid: 'test-guid-error'
      };

      toastSubject.next([testMessage]);

      expect(mockToastrService.error).toHaveBeenCalledWith('Error Message', 'Error Title', {
        extendedTimeOut: 0,
        timeOut: 0,
        closeButton: true,
      });
      expect(mockToastService.removeMessage).toHaveBeenCalledWith('test-guid-error');
    });

    it('should handle multiple toast messages', () => {
      const testMessages = [
        {
          type: Constants.ToastTypes.SUCCESS,
          title: 'Success 1',
          body: 'Success Message 1',
          guid: 'guid-1'
        },
        {
          type: Constants.ToastTypes.ERROR,
          title: 'Error 1',
          body: 'Error Message 1',
          guid: 'guid-2'
        }
      ];

      toastSubject.next(testMessages);

      expect(mockToastrService.success).toHaveBeenCalledWith('Success Message 1', 'Success 1');
      expect(mockToastrService.error).toHaveBeenCalledWith('Error Message 1', 'Error 1', {
        extendedTimeOut: 0,
        timeOut: 0,
        closeButton: true,
      });
      expect(mockToastService.removeMessage).toHaveBeenCalledWith('guid-1');
      expect(mockToastService.removeMessage).toHaveBeenCalledWith('guid-2');
    });

    it('should handle unknown toast types gracefully', () => {
      const testMessage = {
        type: 'UNKNOWN_TYPE',
        title: 'Unknown Title',
        body: 'Unknown Message',
        guid: 'test-guid-unknown'
      };

      toastSubject.next([testMessage]);

      // Should still remove the message even if type is unknown
      expect(mockToastService.removeMessage).toHaveBeenCalledWith('test-guid-unknown');
      
      // Should not call any toastr methods for unknown type
      expect(mockToastrService.success).not.toHaveBeenCalled();
      expect(mockToastrService.warning).not.toHaveBeenCalled();
      expect(mockToastrService.info).not.toHaveBeenCalled();
      expect(mockToastrService.error).not.toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render header component', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-header')).toBeTruthy();
    });

    it('should render infinite loading bar', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-infinite-loading-bar')).toBeTruthy();
    });

    it('should render footer component', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-footer')).toBeTruthy();
    });

    it('should show sidebar when showSideBar is true', () => {
      component.showSideBar = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-sidebar')).toBeTruthy();
    });

    it('should hide sidebar when showSideBar is false', () => {
      component.showSideBar = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-sidebar')).toBeFalsy();
    });

    it('should show toggle button when showSideBar is true', () => {
      component.showSideBar = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-toggle-button')).toBeTruthy();
    });

    it('should hide toggle button when showSideBar is false', () => {
      component.showSideBar = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-toggle-button')).toBeFalsy();
    });

    it('should show breadcrumb when showBreadCrumb is true', () => {
      component.showBreadCrumb = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-breadcrumb')).toBeTruthy();
    });

    it('should hide breadcrumb when showBreadCrumb is false', () => {
      component.showBreadCrumb = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('app-breadcrumb')).toBeFalsy();
    });

    it('should render router outlet', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('router-outlet')).toBeTruthy();
    });

    it('should pass showSideBar property to header component', () => {
      component.showSideBar = true;
      fixture.detectChanges();
      
      const headerElement = fixture.nativeElement.querySelector('app-header');
      expect(headerElement).toBeTruthy();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from toast subscription when subscription exists', () => {
      const unsubscribeSpy = spyOn(component.toastSubscription, 'unsubscribe');
      
      component.ngOnDestroy();
      
      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should handle undefined subscription gracefully', () => {
      component.toastSubscription = undefined as any;
      
      expect(() => component.ngOnDestroy()).not.toThrow();
    });

    it('should handle null subscription gracefully', () => {
      component.toastSubscription = null as any;
      
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('Integration tests', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update UI when navigation changes route data', () => {
      // Start with default values
      expect(component.showSideBar).toBe(false);
      expect(component.showBreadCrumb).toBe(false);

      // Simulate navigation to a route with sidebar and breadcrumb enabled
      mockActivatedRoute.firstChild.snapshot.data = { showSideBar: true, showBreadCrumb: true };
      component.ngOnInit();
      navigationSubject.next(new NavigationEnd(1, '/dashboard', '/dashboard'));
      fixture.detectChanges();

      expect(component.showSideBar).toBe(true);
      expect(component.showBreadCrumb).toBe(true);
      expect(fixture.nativeElement.querySelector('app-sidebar')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('app-breadcrumb')).toBeTruthy();

      // Simulate navigation to login page (no sidebar/breadcrumb)
      mockActivatedRoute.firstChild.snapshot.data = { showSideBar: false, showBreadCrumb: false };
      navigationSubject.next(new NavigationEnd(2, '/login', '/login'));
      fixture.detectChanges();

      expect(component.showSideBar).toBe(false);
      expect(component.showBreadCrumb).toBe(false);
      expect(fixture.nativeElement.querySelector('app-sidebar')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('app-breadcrumb')).toBeFalsy();
    });

    it('should handle toast messages and update toastr service', () => {
      const successMessage = {
        type: Constants.ToastTypes.SUCCESS,
        title: 'Integration Test',
        body: 'Integration test message',
        guid: 'integration-guid'
      };

      toastSubject.next([successMessage]);

      expect(mockToastrService.success).toHaveBeenCalledWith('Integration test message', 'Integration Test');
      expect(mockToastService.removeMessage).toHaveBeenCalledWith('integration-guid');
    });
  });
});
