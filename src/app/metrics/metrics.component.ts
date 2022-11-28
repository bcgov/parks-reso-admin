import { Component, OnDestroy } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { ApiService } from '../services/api.service';
import { Constants } from '../shared/utils/constants';
import Chart from 'chart.js/auto';
import { firstValueFrom, Subscription } from 'rxjs';
import { DataService } from '../services/data.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnDestroy {
  private subscriptions = new Subscription();
  public loading: boolean = false;

  passStatusChart;
  passExport;
  canvas: any;
  ctx: any;
  isGenerating: any = false;
  statusMessage: any;
  signedURL: any;
  buttonText: any = 'Export Pass Data';

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    protected dataService: DataService,
    protected loadingService: LoadingService
  ) {
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.PASS_BREAKDOWN_BY_STATUS)
        .subscribe((res) => {
          if (res) {
            this.buildDoughnutChart(res);
          }
        })
    );

    this.subscriptions.add(
      loadingService.getLoadingStatus().subscribe((res) => {
        this.loading = res;
      })
    );
  }

  buildDoughnutChart(res) {
    let data: string[] = [];
    let labels: string[] = [];

    for (const item of Object.keys(res)) {
      labels.push(item);
      data.push(res[item]);
    }

    this.canvas = document.getElementById('passChart');
    this.ctx = this.canvas.getContext('2d');
    this.passStatusChart = new Chart(this.canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#E4E4E4', //cancelled
              '#75b343', //active
              '#205d38', //reserved
              '#fdb813', //expired
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  async exportPassData() {
    this.isGenerating = true;
    this.signedURL = null;
    // Call export all pass api
    const res = await firstValueFrom(this.apiService.get('export-all-pass'));
    const self = this;
    setTimeout(function () {
      self.statusMessage = res['status'];
      self.getPassExport(res['sk']);
    }, 1000);
  }

  async getPassExport(sk) {
    const self = this;
    const params = {
      getJob: sk,
    };
    const res = await firstValueFrom(
      this.apiService.get('export-all-pass', params)
    );
    this.statusMessage = res['status'];
    if (
      res['status'] === 'Job not found' || res['jobObj'].progressPercentage === -1) {
      // last job failed
      this.isGenerating = false;
      this.buttonText = 'Export Pass Data';
      this.toastService.addMessage(
        `Sorry, that didn't work. Please try again.`,
        'Export Service',
        Constants.ToastTypes.ERROR
      );
    } else if (res['status'] === 'Job complete') {
      // Show the DL link.
      this.isGenerating = false;
      this.buttonText = 'Export Pass Data';
      this.signedURL = res['signedURL'];

      this.toastService.addMessage(
        `Your report is downloading.`,
        'Export Service',
        Constants.ToastTypes.SUCCESS
      );

      // Set a delay so they see the toast msg.
      setTimeout(function () {
        window.open(self.signedURL, '_blank');
      }, 5000);
    } else {
      setTimeout(function () {
        self.getPassExport(sk);
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
