import { Component, OnInit } from '@angular/core';
import { MetricService } from 'app/services/metric.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
  passStatusChart;
  canvas: any;
  ctx: any;

  constructor(private metricService: MetricService) {}

  async ngOnInit() {
    const payload = await this.metricService.fetchData('passTotals');
    let labels = [];
    let data = [];
    for (const item of Object.keys(payload)) {
      labels.push(item);
      data.push(payload[item]);
    }

    this.canvas = document.getElementById('chart1');
    this.ctx = this.canvas.getContext('2d');
    this.passStatusChart = new Chart(this.canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(100, 33, 155, 0.2)',
              'rgba(100, 33, 77, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(100, 33, 155, 1)',
              'rgba(100, 33, 77, 0.2)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
