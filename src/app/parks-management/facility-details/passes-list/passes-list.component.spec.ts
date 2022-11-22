import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { KeycloakService } from 'src/app/services/keycloak.service';

import { PassesListComponent } from './passes-list.component';

describe('PassesListComponent', () => {
  let component: PassesListComponent;
  let fixture: ComponentFixture<PassesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassesListComponent],
      providers: [HttpClient, HttpHandler, ConfigService, BsModalService, KeycloakService],
    }).compileComponents();

    fixture = TestBed.createComponent(PassesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
