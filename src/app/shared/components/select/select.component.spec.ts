import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectComponent],
      imports: [CommonModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits an event', async () => {
    const eventSpy = spyOn(component.output, 'emit');
    component.emit('mock');
    expect(eventSpy).toHaveBeenCalledOnceWith('mock');
  });
});
