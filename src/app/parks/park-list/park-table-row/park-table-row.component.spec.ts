import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParksModule } from 'app/parks/parks.module';

import { ParkTableRowComponent } from './park-table-row.component';

describe('ParkTableRowComponent', () => {
  let component: ParkTableRowComponent;
  let fixture: ComponentFixture<ParkTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [ParksModule, ReactiveFormsModule, FormsModule]
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
