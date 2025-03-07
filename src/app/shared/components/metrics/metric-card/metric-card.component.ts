import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-metric-card',
    templateUrl: './metric-card.component.html',
    styleUrls: ['./metric-card.component.scss'],
    standalone: true
})
export class MetricCardComponent {
  @Input() title: string
}
