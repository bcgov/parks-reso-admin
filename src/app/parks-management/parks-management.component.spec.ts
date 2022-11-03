import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParksManagementComponent } from './parks-management.component';

describe('ParksManagementComponent', () => {
  let component: ParksManagementComponent;
  let fixture: ComponentFixture<ParksManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParksManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParksManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
