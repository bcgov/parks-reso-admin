import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassManagementComponent } from './pass-management.component';

describe('PassManagementComponent', () => {
  let component: PassManagementComponent;
  let fixture: ComponentFixture<PassManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
