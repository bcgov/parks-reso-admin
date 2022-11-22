import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { KeycloakService } from 'src/app/services/keycloak.service';

import { PassesUtilityButtonsComponent } from './passes-utility-buttons.component';

describe('PassesUtilityButtonsComponent', () => {
  let component: PassesUtilityButtonsComponent;
  let fixture: ComponentFixture<PassesUtilityButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassesUtilityButtonsComponent],
      providers: [HttpClient, HttpHandler, ConfigService, KeycloakService],
    }).compileComponents();

    fixture = TestBed.createComponent(PassesUtilityButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
