import {
  Component,
  Input,
} from '@angular/core';
import { Utils } from '../../../utils/utils';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-shortdate-picker',
  templateUrl: './shortdate-picker.component.html',
  styleUrls: ['./shortdate-picker.component.scss'],
})
export class ShortdatePickerComponent
  extends BaseInputComponent
{
  @Input() minDate: Date = null as any;
  @Input() maxDate: Date = null as any;
  @Input() range: boolean = false;

  public modelDate;

  private utils = new Utils();

  constructor(
  ){
    super();
    this.subscriptions.add(
      this.controlInitialized.subscribe((value) => {
        if (value) {
          this.initializeControl();
        }
      })
    )
  }

  initializeControl() {
    this.modelDate = this.control?.value || null;
    this.subscriptions.add(
      this.control.valueChanges.subscribe((res) => {
        this.modelDate = res || null;
      })
    );
  }

  checkDisabled() {
    return this.control?.disabled || false;
  }

  onDateChange() {
    this.control.setValue(this.utils.convertJSDateToShortDate(this.modelDate));
    this.control.markAsDirty();
  }

  clearDate() {
    console.log('cleared');
    this.modelDate = null as any;
    this.control.setValue(null);
    this.control.markAsDirty();
  }
}
