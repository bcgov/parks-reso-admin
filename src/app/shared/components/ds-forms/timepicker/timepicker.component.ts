import {
  Component,
  Input,
  EventEmitter,
} from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
})
// Component control value must be of type NgbTimeStruct:
// {hour: 24hour, minute: minute, second: second}
export class TimepickerComponent extends BaseInputComponent {
  @Input() reset: EventEmitter<any>;
  @Input() showSeconds = false;
  @Input() showMinutes = true;
  @Input() is24HTime = false;
  @Input() defaultTime = { hour: 0, minute: 0, second: 0 };

  public initialTime;
  public isInitialLoad = true;
  public modelTime;
  public utils = new Utils();

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

  initializeControl(): void {
    this.initialTime = {
      hour: this.control?.value?.hour || this.defaultTime.hour,
      minute: this.control?.value?.minute || this.defaultTime.minute,
      second: this.control?.value?.second || this.defaultTime.second,
    };
    this.setTime(
      this.initialTime.hour,
      this.initialTime.minute,
      this.initialTime.second
    );
    if (this.reset) {
      this.subscriptions.add(
        this.reset.subscribe(() => {
          this.clearTime();
        })
      );
    }
  }

  setTime(hour, minute, second): void {
    this.modelTime = new Date();
    this.modelTime.setHours(hour, minute, second);
    this.control.setValue(
      this.utils.convertJSDateToNgbTimeStruct(this.modelTime)
    );
  }

  onTimeChange(event) {
    if (this.isInitialLoad) {
      this.isInitialLoad = false;
    } else {
      this.control.markAsDirty();
    }
    if (!event || !this.modelTime) {
      this.clearTime();
    }
    this.control.setValue(
      this.utils.convertJSDateToNgbTimeStruct(this.modelTime)
    );
  }

  clearTime() {
    this.setTime(
      this.initialTime.hour,
      this.initialTime.minute,
      this.initialTime.second
    );
    this.control.setValue(
      this.utils.convertJSDateToNgbTimeStruct(this.modelTime)
    );
    this.isInitialLoad = true;
    this.control.markAsPristine();
  }
}
