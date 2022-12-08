import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Utils } from 'src/app/shared/utils/utils';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
})
// Component control value must be of type NgbTimeStruct:
// {hour: 24hour, minute: minute, second: second}
export class TimepickerComponent
  extends BaseInputComponent
  implements OnInit, OnDestroy
{
  @Input() reset: EventEmitter<any>;
  @Input() showSeconds = false;
  @Input() showMinutes = true;
  @Input() is24HTime = false;
  @Input() defaultTime = { hour: 0, minute: 0, second: 0 };

  private subscriptions = new Subscription();
  public initialTime;
  public modelTime;
  public utils = new Utils();

  ngOnInit(): void {
    this.initialTime = {
      hour: this.control?.value?.hour || this.defaultTime.hour,
      minute: this.control?.value?.minute || this.defaultTime.minute,
      second: this.control?.value?.second || this.defaultTime.second
    }
    this.setTime(
      this.initialTime.hour,
      this.initialTime.minute,
      this.initialTime.second,
    );
    if (this.reset) {
      this.subscriptions.add(this.reset.subscribe(() => this.clearDate()));
    }
  }

  setTime(hour, minute, second): void {
    this.modelTime = new Date();
    this.modelTime.setHours(hour, minute, second);
  }

  onTimeChange(event) {
    if (!event || !this.modelTime) {
      this.setTime(
        this.initialTime.hour,
        this.initialTime.minute,
        this.initialTime.second
      );
    }
    this.control.setValue(
      this.utils.convertJSDateToNgbTimeStruct(this.modelTime)
    );
  }

  clearDate() {
    this.modelTime = null as any;
    this.control.setValue(null);
    this.control.markAsDirty();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
