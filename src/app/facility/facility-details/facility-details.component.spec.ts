import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilitiesModule } from 'app/facilities/facilities.module';
import { PassesModule } from 'app/passes/passes.module';
import { ConfigService } from 'app/services/config.service';
import { KeycloakService } from 'app/services/keycloak.service';
import { FormGeneratorModule } from 'app/shared/form-generator/form-generator.module';

import { FacilityDetailsComponent } from './facility-details.component';

describe('FacilityDetailsComponent', () => {
  let component: FacilityDetailsComponent;
  let fixture: ComponentFixture<FacilityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        FacilitiesModule,
        PassesModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        FormGeneratorModule
      ],
      providers: [
        ConfigService,
        KeycloakService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
