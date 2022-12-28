import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableButtonComponent } from './table-button.component';

describe('TableButtonComponent', () => {
  let component: TableButtonComponent;
  let fixture: ComponentFixture<TableButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handles button clicking', async () => {
    const e = new Event('click');
    const eventSpy = spyOn(e, 'stopPropagation');
    const clickSpy = spyOn(component, 'onClick');
    component.onButtonClick(e);
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
