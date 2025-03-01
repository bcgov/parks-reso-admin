import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-metrics',
    templateUrl: './metrics.component.html',
    styleUrls: ['./metrics.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class MetricsComponent {
}
