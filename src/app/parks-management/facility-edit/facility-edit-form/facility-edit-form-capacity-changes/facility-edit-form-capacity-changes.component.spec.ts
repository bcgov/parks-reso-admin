import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityEditFormCapacityChangesComponent } from './facility-edit-form-capacity-changes.component';

describe('FacilityEditFormCapacityChangesComponent', () => {
  let component: FacilityEditFormCapacityChangesComponent;
  let fixture: ComponentFixture<FacilityEditFormCapacityChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityEditFormCapacityChangesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityEditFormCapacityChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
