import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';

import { BaseInputComponent } from './base-input.component';

describe('BaseInputComponent', () => {
  let component: BaseInputComponent;
  let fixture: ComponentFixture<BaseInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should know if the input is required', () => {
    component.control.addValidators(Validators.required);
    expect(component.isRequired()).toBe(true);
    component.control.removeValidators(Validators.required);
    expect(component.isRequired()).toBe(false);
  });

  it('should know if the input is invalid', () => {
    expect(component.isInvalid()).toBe(false);
    component.control.addValidators(Validators.required);
    component.control.setValue(null);
    component.control.markAsTouched();
    expect(component.isInvalid()).toBe(true);
  });

  it('should emit when onChange fired', () => {
    spyOn(component.inputChange, 'emit');
    component.onChange('test');
    expect(component.inputChange.emit).toHaveBeenCalledWith('test');
  });
});
