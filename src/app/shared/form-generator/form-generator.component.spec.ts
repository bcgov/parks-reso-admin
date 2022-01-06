import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteMultiSelectModule } from '../components/autocomplete-multi-select/autocomplete-multi-select.module';
import { DatePickerModule } from '../components/date-picker/date-picker.module';
import { Utils } from '../utils/utils';

import { FormGeneratorComponent } from './form-generator.component';

describe('FormGeneratorComponent', () => {
  let component: FormGeneratorComponent;
  let fixture: ComponentFixture<FormGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DatePickerModule, FormsModule, ReactiveFormsModule, CommonModule, AutoCompleteMultiSelectModule],
      declarations: [FormGeneratorComponent],
      providers: [Utils]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
