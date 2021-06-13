import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilitiesModule } from 'app/facilities/facilities.module';
import { ConfigService } from 'app/services/config.service';
import { KeycloakService } from 'app/services/keycloak.service';
import { DialogService } from 'ng2-bootstrap-modal';

import { FacilityFormComponent } from './facility-form.component';

describe('FacilityFormComponent', () => {
  let component: FacilityFormComponent;
  let fixture: ComponentFixture<FacilityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        FacilitiesModule,
        HttpClientTestingModule
      ],
      providers: [
        ConfigService,
        KeycloakService,
        { provide: DialogService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
