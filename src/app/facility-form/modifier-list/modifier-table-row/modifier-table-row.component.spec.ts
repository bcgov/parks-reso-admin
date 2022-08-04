import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogService } from 'ng2-bootstrap-modal';

import { ModifierTableRowComponent } from './modifier-table-row.component';

describe('ModifierTableRowComponent', () => {
  let component: ModifierTableRowComponent;
  let fixture: ComponentFixture<ModifierTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierTableRowComponent],
      providers: [DialogService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierTableRowComponent);
    component = fixture.componentInstance;
    component.rowData = { sk: '2022-08-05' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
