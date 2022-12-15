import {
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Utils } from '../../../utils/utils';
import { Subscription } from 'rxjs';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-shortdate-picker',
  templateUrl: './shortdate-picker.component.html',
  styleUrls: ['./shortdate-picker.component.scss'],
})
export class ShortdatePickerComponent
  extends BaseInputComponent
  implements OnInit, OnDestroy
{
  @Input() minDate: Date = null as any;
  @Input() maxDate: Date = null as any;

  private subscriptions = new Subscription();

  public modelDate;

  private utils = new Utils();

  ngOnInit() {
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
    this.modelDate = null as any;
    this.control.setValue(null);
    this.control.markAsDirty();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
