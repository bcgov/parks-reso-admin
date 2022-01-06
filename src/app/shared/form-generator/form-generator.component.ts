import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Utils } from 'app/shared/utils/utils';

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss']
})
export class FormGeneratorComponent implements OnInit {
  @Input() formComponents: Array<any> = [];
  @Output() submitEvent: EventEmitter<any> = new EventEmitter();
  @Input() loadingStatus: boolean;

  public form = new FormGroup({});
  private datePickerKeys = [];
  private selectKeys = [];
  private autoMultiSelectKeys = [];
  private textKeys = [];

  constructor(private utils: Utils) {}

  ngOnInit() {
    let controls = {};
    this.formComponents.forEach(obj => {
      switch (obj.formType) {
        case 'date':
          controls[obj.value] = new FormControl();
          if (obj.initialValue !== undefined) {
            controls[obj.value].setValue(this.utils.convertJSDateToNGBDate(new Date(obj.initialValue)));
            controls[obj.value].markAsDirty();
          }
          this.datePickerKeys.push(obj.value);
          break;
        case 'select':
          controls[obj.value] = new FormControl();
          obj.options.forEach(option => {
            if (option.initialValue) {
              controls[obj.value].setValue(option.selectValue);
              controls[obj.value].markAsDirty();
            }
          });
          this.selectKeys.push(obj.value);
          break;
        case 'autoMultiSelect':
          controls[obj.value] = new FormControl('');
          if (obj.initialValue !== undefined) {
            controls[obj.value].setValue(obj.initialValue);
            controls[obj.value].markAsDirty();
          }
          this.autoMultiSelectKeys.push(obj.value);
          break;
        case 'text':
          controls[obj.value] = new FormControl('');
          if (obj.initialValue !== undefined) {
            controls[obj.value].setValue(obj.initialValue);
            controls[obj.value].markAsDirty();
          }
          this.textKeys.push(obj.value);
          break;
        default:
          break;
      }
      this.form = new FormGroup(controls);
    });
  }

  submit() {
    let paramsObj = {};
    Object.keys(this.form.controls).forEach(key => {
      if (this.form.get(key).dirty) {
        if (this.datePickerKeys.includes(key)) {
          let jsDate = this.utils.convertFormGroupNGBDateToJSDate(this.form.get(key).value);
          if (jsDate) {
            paramsObj[key] = jsDate;
          }
        } else {
          paramsObj[key] = this.form.get(key).value;
        }
      }
    });
    if (paramsObj !== {}) {
      this.submitEvent.emit(paramsObj);
    }
  }
}
