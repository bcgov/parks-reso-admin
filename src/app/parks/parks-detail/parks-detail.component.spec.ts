import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParksDetailComponent } from './parks-detail.component';

describe('ParksDetailComponent', () => {
  let component: ParksDetailComponent;
  let fixture: ComponentFixture<ParksDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParksDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParksDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
