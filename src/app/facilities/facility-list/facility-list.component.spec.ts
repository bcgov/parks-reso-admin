import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityListComponent } from './facility-list.component';

describe('FacilityListComponent', () => {
  let component: FacilityListComponent;
  let fixture: ComponentFixture<FacilityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacilityListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
