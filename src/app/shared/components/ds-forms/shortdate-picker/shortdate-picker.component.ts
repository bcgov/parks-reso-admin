import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Utils } from '../../../utils/utils';
import { BaseInputComponent } from '../base-input/base-input.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-shortdate-picker',
    templateUrl: './shortdate-picker.component.html',
    styleUrls: ['./shortdate-picker.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        BsDatepickerModule,
        FormsModule,
    ],
})
export class ShortdatePickerComponent extends BaseInputComponent implements OnChanges {
  @Input() minDate: Date = null as any;
  @Input() maxDate: Date = null as any;
  @Input() range: boolean = false;
  @Input() maxDateRange: number = 366; // 1 year is the default max range

  public modelDate;

  private utils = new Utils();

  constructor() {
    super();
    this.subscriptions.add(
      this.controlInitialized.subscribe((value) => {
        if (value) {
          this.initializeControl();
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['control'].currentValue.value) {
      this.modelDate = null as any;
    }
  }

  initializeControl() {
    if (this.range) {
      if (this.control.value) {
        this.modelDate = [
          this.utils.convertShortDateToJSDate(this.control.value[0] || null),
          this.utils.convertShortDateToJSDate(this.control.value[1] || null),
        ];
      }
    } else {
      this.modelDate = this.control.value || null;
    }
    this.subscriptions.add(
      this.control.valueChanges.subscribe((res) => {
        if (this.range && res) {
          this.modelDate = [
            this.utils.convertShortDateToJSDate(res[0]),
            this.utils.convertShortDateToJSDate(res[1]),
          ];
        } else {
          this.modelDate = res || null;
        }
      })
    );
  }

  checkDisabled() {
    return this.control?.disabled || false;
  }

  onDateChange() {
    if (this.range) {
      this.control.setValue([
        this.utils.convertJSDateToShortDate(this.modelDate[0]),
        this.utils.convertJSDateToShortDate(this.modelDate[1]),
      ]);
    } else {
      this.control.setValue(
        this.utils.convertJSDateToShortDate(this.modelDate)
      );
    }
    this.control.markAsDirty();
  }

  clearDate() {
    this.modelDate = null as any;
    this.control.setValue(null);
    this.control.markAsDirty();
  }
}
