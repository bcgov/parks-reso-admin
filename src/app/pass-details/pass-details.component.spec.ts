import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassDetailsComponent } from './pass-details.component';

describe('PassDetailsComponent', () => {
  let component: PassDetailsComponent;
  let fixture: ComponentFixture<PassDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
