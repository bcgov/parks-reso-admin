import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Utils } from 'app/shared/utils/utils';
import { SearchWidgetObject } from './search-widget-object';

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.scss']
})
export class SearchWidgetComponent implements OnInit {
  @Input() datePickerArray: Array<SearchWidgetObject> = [];
  @Input() textSearchArray: Array<SearchWidgetObject> = [];
  @Input() multiSelectArray: Array<SearchWidgetObject> = [];
  @Output() submitEvent: EventEmitter<any> = new EventEmitter();
  @Input() loadingStatus: boolean;

  public form;

  private datePickerKeys = [];

  constructor(private utils: Utils) {}

  ngOnInit() {
    let controls = {};
    this.datePickerArray.forEach(obj => {
      controls[obj.value] = new FormControl();
      if (obj.initialValue !== undefined) {
        controls[obj.value].setValue(this.utils.convertJSDateToNGBDate(new Date(obj.initialValue)));
      }
    });
    this.textSearchArray.forEach(obj => {
      controls[obj.value] = new FormControl('');
      if (obj.initialValue !== undefined) {
        controls[obj.value].setValue(obj.initialValue);
      }
    });
    this.multiSelectArray.forEach(obj => {
      controls[obj.value] = new FormControl('');
      if (obj.initialValue !== undefined) {
        controls[obj.value].setValue(obj.initialValue);
      }
    });
    this.form = new FormGroup(controls);

    this.datePickerArray.forEach(obj => {
      this.datePickerKeys.push(obj.value);
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
          if (this.form.get(key).value) {
            paramsObj[key] = this.form.get(key).value;
          }
        }
      }
    });
    if (paramsObj !== {}) {
      this.submitEvent.emit(paramsObj);
    }
  }
}
