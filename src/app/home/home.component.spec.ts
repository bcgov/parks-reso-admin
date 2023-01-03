import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from '../services/config.service';
import { KeycloakService } from '../services/keycloak.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let fakeKeyCloakService;

  beforeEach(async () => {
    fakeKeyCloakService = {
      isAllowed: () => true,
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent],
      providers: [
        { provide: KeycloakService, useValue: fakeKeyCloakService },
        ConfigService,
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fakeKeyCloakService.isAllowed();
    expect(component).toBeTruthy();
    let cardElement = fixture.debugElement.nativeElement.getElementsByTagName('app-nav-card');
    expect(cardElement.length).toEqual(2);
  });
});
