import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilitiesModule } from 'app/facilities/facilities.module';

import { ParkDetailsComponent } from './park-details.component';

describe('ParkDetailsComponent', () => {
  let component: ParkDetailsComponent;
  let fixture: ComponentFixture<ParkDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParkDetailsComponent, ],
      imports: [FacilitiesModule, ReactiveFormsModule, FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
