import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityEditFormPublishingDetailsComponent } from './facility-edit-form-publishing-details.component';

describe('FacilityEditFormPublishingDetailsComponent', () => {
  let component: FacilityEditFormPublishingDetailsComponent;
  let fixture: ComponentFixture<FacilityEditFormPublishingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FacilityEditFormPublishingDetailsComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(FacilityEditFormPublishingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
