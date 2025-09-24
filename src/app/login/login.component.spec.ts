import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { KeycloakService } from '../services/keycloak.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockKeycloakService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockKeycloakService = {
      isAuthenticated: jasmine.createSpy(),
      isAuthorized: jasmine.createSpy(),
      login: jasmine.createSpy()
    };
    mockRouter = {
      navigate: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: KeycloakService, useValue: mockKeycloakService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "/" if authenticated and authorized', () => {
    mockKeycloakService.isAuthenticated.and.returnValue(true);
    mockKeycloakService.isAuthorized.and.returnValue(true);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to "/unauthorized" if authenticated but not authorized', () => {
    mockKeycloakService.isAuthenticated.and.returnValue(true);
    mockKeycloakService.isAuthorized.and.returnValue(false);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should not navigate if not authenticated', () => {
    mockKeycloakService.isAuthenticated.and.returnValue(false);

    component.ngOnInit();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should call keycloakService.login with idpHint on handleLogin', () => {
    const idpHint = 'test-idp';
    component.handleLogin(idpHint);

    expect(mockKeycloakService.login).toHaveBeenCalledWith(idpHint);
  });
});