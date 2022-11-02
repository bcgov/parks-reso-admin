import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Utils } from '../../../utils/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shortdate-picker',
  templateUrl: './shortdate-picker.component.html',
  styleUrls: ['./shortdate-picker.component.scss'],
})
export class ShortdatePickerComponent implements OnInit, OnDestroy {
  @Input() label;
  @Input() id;
  @Input() icon;
  @Input() ariaLabel;
  @Input() ariaDescribedBy;
  @Input() control: UntypedFormControl;
  @Input() isValidate = false;
  @Input() isDisabled = false;
  @Input() minDate: Date = null as any;
  @Input() maxDate: Date = null as any;
  @Input() reset: EventEmitter<any>;
  @Input() required = false;

  private subscriptions = new Subscription();

  public modelDate;

  private utils = new Utils();

  ngOnInit() {
    this.modelDate = this.control?.value || null;
    if (this.reset) {
      this.subscriptions.add(this.reset.subscribe(() => this.clearDate()));
    }
  }

  checkDisabled(){
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
