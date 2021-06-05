import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PassesModule } from 'app/passes/passes.module';

import { PassTableRowComponent } from './pass-table-row.component';

describe('PassTableRowComponent', () => {
  let component: PassTableRowComponent;
  let fixture: ComponentFixture<PassTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [PassesModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
