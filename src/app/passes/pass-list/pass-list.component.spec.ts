import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'app/services/config.service';
import { KeycloakService } from 'app/services/keycloak.service';
import { SharedModule } from 'app/shared/shared.module';
import { PassesModule } from '../passes.module';

import { PassListComponent } from './pass-list.component';

describe('PassListComponent', () => {
  let component: PassListComponent;
  let fixture: ComponentFixture<PassListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        SharedModule,
        PassesModule,
        HttpClientTestingModule
      ],
      providers: [
        ConfigService,
        KeycloakService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
