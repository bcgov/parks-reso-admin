import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParksAddComponent } from './parks-add.component';

describe('ParksAddComponent', () => {
  let component: ParksAddComponent;
  let fixture: ComponentFixture<ParksAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParksAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParksAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
