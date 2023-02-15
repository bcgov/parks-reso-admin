import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-chart-metric',
  templateUrl: './chart-metric.component.html',
  styleUrls: ['./chart-metric.component.scss'],
})
export class ChartMetricComponent implements OnDestroy, AfterViewInit {
  @Input() type: keyof ChartTypeRegistry; // bar, bubble, doughnut, pie, line, polarArea, radar, scatter
  @Input() set labels(labels: string[]) {
    this._labels.next(labels);
  }
  @Input() set datasets(datasets: any[]) {
    this._datasets.next(datasets);
  }
  @Input() set options(options: any) {
    this._options.next(options);
  }
  @Input() set plugins(plugins: any[]) {
    this._plugins.next(plugins);
  }

  @ViewChild('chartId') canvasRef: ElementRef;

  private subscriptions = new Subscription();
  private readonly _labels = new BehaviorSubject(undefined);
  private readonly _datasets = new BehaviorSubject(null);
  private readonly _plugins = new BehaviorSubject([]);
  private readonly _options = new BehaviorSubject({});
  private readonly _isChartReady = new BehaviorSubject(undefined);

  public canvas: any;
  public chart: any;

  constructor() {
    this.subscriptions.add(
      combineLatest([
        this._isChartReady,
        this._labels,
        this._datasets,
      ]).subscribe((changes) => {
        if (!changes.includes(undefined)) {
          this.buildChart();
        }
      })
    );
  }

  ngAfterViewInit() {
    // In the event our async data is ready before the DOM,
    // we have to wait for the <canvas> element to be ready.
    this._isChartReady.next(true);
  }

  buildChart() {
    this.canvas = this.canvasRef.nativeElement;
    if (!this.chart) {
      this.chart = new Chart(this.canvas, {
        type: this.type,
        data: {
          labels: this._labels?.value || [],
          datasets: this._datasets?.value || [],
        },
        options: this._options?.value || {},
        plugins: this._plugins?.value || [],
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
