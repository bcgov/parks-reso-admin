import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEditButtonComponent } from './edit-button.component';

describe('EditButtonComponent', () => {
  let component: TableEditButtonComponent;
  let fixture: ComponentFixture<TableEditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableEditButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
