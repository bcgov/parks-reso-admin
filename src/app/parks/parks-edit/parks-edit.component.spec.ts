import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParksEditComponent } from './parks-edit.component';

describe('ParksEditComponent', () => {
  let component: ParksEditComponent;
  let fixture: ComponentFixture<ParksEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParksEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParksEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
