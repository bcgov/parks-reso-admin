import { Component, OnInit } from '@angular/core';
import { MetricService } from 'app/services/metric.service';
import Chart from 'chart.js/auto';
import { ApiService } from 'app/services/api.service';
import { ToastService } from 'app/services/toast.service';
import { Constants } from 'app/shared/utils/constants';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
  passStatusChart;
  canvas: any;
  ctx: any;
  isGenerating: any = false;
  statusMessage: any;
  signedURL: any;
  buttonText: any = 'Export Pass Data';

  constructor(private metricService: MetricService, private apiService: ApiService, private toastService: ToastService) {}

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

  async exportPassData() {
    this.isGenerating = true;
    this.signedURL = null;

    // Call export all pass api
    const res = await this.apiService.get('export-all-pass');
    const self = this;
    setTimeout(function () {
      self.statusMessage = res.status;
      self.getPassExport(res.sk);
    }, 1000);
  }

  async getPassExport(sk) {
    const self = this;
    const params = {
      getJob: sk
    };
    const res = await this.apiService.get('export-all-pass', params);
    this.statusMessage = res.status;
    if (res.status === 'Job not found' || res.jobObj.progressPercentage === -1) {
      // last job failed
      this.isGenerating = false;
      this.buttonText = 'Export Pass Data';
      this.toastService.addMessage(
        `Sorry, that didn't work. Please try again.`,
        'Export Service',
        Constants.ToastTypes.ERROR
      );
    } else if (res.status === 'Job complete') {
      // Show the DL link.
      this.isGenerating = false;
      this.buttonText = 'Export Pass Data';
      this.signedURL = res.signedURL;

      this.toastService.addMessage(
        `Your report is downloading.`,
        'Export Service',
        Constants.ToastTypes.SUCCESS
      );

      // Set a delay so they see the toast msg.
      setTimeout(function() {
        window.open(self.signedURL, '_blank');
      }, 5000);
    } else {
      setTimeout(function () {
        self.getPassExport(sk);
      }, 1000);
    }
  }
}
