import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityAddComponent } from './facility-add.component';

describe('FacilityAddComponent', () => {
  let component: FacilityAddComponent;
  let fixture: ComponentFixture<FacilityAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacilityAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
