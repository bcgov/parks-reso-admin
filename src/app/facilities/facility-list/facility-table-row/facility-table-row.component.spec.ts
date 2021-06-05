import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilitiesModule } from 'app/facilities/facilities.module';

import { FacilityTableRowComponent } from './facility-table-row.component';

describe('FacilityTableRowComponent', () => {
  let component: FacilityTableRowComponent;
  let fixture: ComponentFixture<FacilityTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [FacilitiesModule, FormsModule, ReactiveFormsModule]
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
