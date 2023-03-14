import { Component, OnDestroy } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/api.service';
import { Constants } from '../../shared/utils/constants';
import { firstValueFrom, Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-site-metrics',
  templateUrl: './site-metrics.component.html',
  styleUrls: ['./site-metrics.component.scss'],
})
export class SiteMetricsComponent implements OnDestroy {
  private subscriptions = new Subscription();
  public loading: boolean = false;

  parkName: string;
  facilityName: string;
  passStatusChart;
  passExport;
  isGenerating: any = false;
  statusMessage: any;
  signedURL: any;
  buttonText: any = 'Export Pass Data';
  doughnutLabels: any;
  doughnutData: any;
  doughnutOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20,
          },
        },
      },
    },
  };
  doughnutPlugins: any;
  scatterLabels: any;
  scatterData: any;
  scatterOptions: any;
  passTotal: number = 0;
  passActive: number = 0;
  passReserved: number = 0;
  passExpired: number = 0;

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
            this.buildCharts(res);
          }
        })
    );

    this.subscriptions.add(
      loadingService.getLoadingStatus().subscribe((res) => {
        this.loading = res;
      })
    );
  }

  buildCharts(res) {
    let data: string[] = [];
    let labels: string[] = [];
    let passTotal: number = 0;

    for (const item of Object.keys(res)) {
      labels.push(item);
      data.push(res[item]);
      passTotal += res[item];
      console.log(item);
      switch (item) {
        case Constants.stateLabelDictionary.active.state:
          this.passActive = res[item];
          break;
        case Constants.stateLabelDictionary.reserved.state:
          this.passReserved = res[item];
          break;
        case Constants.stateLabelDictionary.expired.state:
          this.passExpired = res[item];
          break;
      }
    }

    this.passTotal = passTotal;
    this.doughnutData = [
      {
        data: data,
        backgroundColor: [
          '#E4E4E4', //cancelled
          '#75b343', //active
          '#205d38', //reserved
          '#fdb813', //expired
        ],
      },
    ];
    this.doughnutLabels = labels;

    //TBD: set data for bar chart
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
      res['status'] === 'Job not found' ||
      res['jobObj'].progressPercentage === -1
    ) {
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
