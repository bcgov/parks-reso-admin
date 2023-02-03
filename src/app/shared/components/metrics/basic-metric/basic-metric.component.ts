import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-basic-metric',
  templateUrl: './basic-metric.component.html',
  styleUrls: ['./basic-metric.component.scss'],
})
export class BasicMetricComponent {
  @Input() label: string; // metric label
  @Input() set value(value: number) {
    this._value = value;
  }
  // optional
  @Input() animate: boolean = false; // animates changes in the metric if true
  @Input() animationDuration: number = 1500; // duration of metric animation
  @Input() animationJitter: boolean = false; // applies jitter to animations to create asynchronous effect

  public _value: number = NaN;
}
