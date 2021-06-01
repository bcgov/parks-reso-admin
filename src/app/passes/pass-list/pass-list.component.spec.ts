import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassListComponent } from './pass-list.component';

describe('PassListComponent', () => {
  let component: PassListComponent;
  let fixture: ComponentFixture<PassListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
