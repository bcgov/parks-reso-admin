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
  @Input() is24HTime = false;

  private subscriptions = new Subscription();
  public modelTime;
  public utils = new Utils();

  ngOnInit(): void {
    this.modelTime = {
      hour: this.control?.value?.hour || 0,
      minute: this.control?.value?.minute || 0,
    };
    if (this.showSeconds) {
      this.modelTime['second'] = this.control?.value?.second || 0;
    }
    if (this.reset) {
      this.subscriptions.add(this.reset.subscribe(() => this.clearDate()));
    }
  }

  onTimeChange() {
    if (this.modelTime) {
      this.control.setValue(this.modelTime);
    }
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
