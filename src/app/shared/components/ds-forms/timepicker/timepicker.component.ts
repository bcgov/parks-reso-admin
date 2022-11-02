import { Component, Input, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
})
export class TimepickerComponent implements OnInit, OnDestroy {
  @Input() control = new UntypedFormControl();
  @Input() label;
  @Input() icon;
  @Input() placeholder;
  @Input() id;
  @Input() ariaLabel;
  @Input() ariaDescribedBy;
  @Input() moneyMode = false;
  @Input() reset: EventEmitter<any>;
  @Input() showSeconds = false;
  @Input() showMinutes = true;
  @Input() is24HTime = false;

  private subscriptions = new Subscription();
  public modelTime;

  constructor() {}

  ngOnInit(): void {
    this.modelTime = this.control?.value || null;
    if (this.reset) {
      this.subscriptions.add(this.reset.subscribe(() => this.clearDate()));
    }
  }

  onTimeChange() {
    if (this.modelTime) {
      if (!this.showMinutes && !this.showSeconds){
        // Just return the 24h time
        this.control.setValue(this.modelTime.getHours());
      } else {
        this.control.setValue(this.modelTime);
      }
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
