import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkTableRowComponent } from './park-table-row.component';

describe('ParkTableRowComponent', () => {
  let component: ParkTableRowComponent;
  let fixture: ComponentFixture<ParkTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkTableRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
