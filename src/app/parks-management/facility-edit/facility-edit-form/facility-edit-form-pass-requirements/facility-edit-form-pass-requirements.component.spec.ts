import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityEditFormPassRequirementsComponent } from './facility-edit-form-pass-requirements.component';

describe('FacilityEditFormPassRequirementsComponent', () => {
  let component: FacilityEditFormPassRequirementsComponent;
  let fixture: ComponentFixture<FacilityEditFormPassRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityEditFormPassRequirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityEditFormPassRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
