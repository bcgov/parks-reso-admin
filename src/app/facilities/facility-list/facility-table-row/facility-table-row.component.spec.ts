import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityTableRowComponent } from './facility-table-row.component';

describe('FacilityTableRowComponent', () => {
  let component: FacilityTableRowComponent;
  let fixture: ComponentFixture<FacilityTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacilityTableRowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
