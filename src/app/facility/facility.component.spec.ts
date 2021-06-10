import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilityFormComponent } from 'app/facility-form/facility-form.component';
import { ConfigService } from 'app/services/config.service';

import { FacilityComponent } from './facility.component';
import { FacilityModule } from './facility.module';

describe('FacilityComponent', () => {
  let component: FacilityComponent;
  let fixture: ComponentFixture<FacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacilityFormComponent],
      imports: [
        FacilityModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        ConfigService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
