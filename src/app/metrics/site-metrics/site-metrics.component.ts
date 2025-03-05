import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/api.service';
import { Constants } from '../../shared/utils/constants';
import { firstValueFrom, Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { LoadingService } from '../../services/loading.service';
import { ChartPlugins } from 'src/app/shared/components/metrics/chart-metric/chart-metric-plugins';
import { Utils } from 'src/app/shared/utils/utils';
import { MetricsService } from 'src/app/services/metrics.service';
import { ChartMetricComponent } from '../../shared/components/metrics/chart-metric/chart-metric.component';
import { BasicMetricComponent } from '../../shared/components/metrics/basic-metric/basic-metric.component';
import { MetricCardComponent } from '../../shared/components/metrics/metric-card/metric-card.component';
import { NgIf, DatePipe } from '@angular/common';
import { MetricsFilterComponent } from '../metrics-filter/metrics-filter.component';

@Component({
    selector: 'app-site-metrics',
    templateUrl: './site-metrics.component.html',
    styleUrls: ['./site-metrics.component.scss'],
    standalone: true,
    imports: [
        MetricsFilterComponent,
        NgIf,
        MetricCardComponent,
        BasicMetricComponent,
        ChartMetricComponent,
        DatePipe,
    ],
})
export class SiteMetricsComponent implements OnDestroy, OnInit {
  private subscriptions = new Subscription();
  public loading: boolean = false;

  public metrics;
  public parksAndFacilities;
  public dateRange;
  public dateInterval;
  public filterParams;
  public singleFacility = false;
  public timezone = 'America/Vancouver';
  public passTotals = {
    active: 0,
    reserved: 0,
    expired: 0,
    cancelled: 0,
    total: 0
  }
  public parkName: string;
  public facilityName: string;
  public doughnutLabels: any;
  public doughnutData: any;
  public doughnutOptions: any;
  public doughnutPlugins: any;
  public barChartLabels: any;
  public barChartData: any;
  public barChartOptions: any;
  public barChartPlugins = [ChartPlugins.barHighlightColumnPlugin];
  public noData = false;
  public utils = new Utils;

  passExport;
  isGenerating: any = false;
  statusMessage: any;
  signedURL: any;
  buttonText: any = 'Export Pass Data';

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private metricsService: MetricsService,
    protected dataService: DataService,
    protected loadingService: LoadingService,
  ) {
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.PARK_AND_FACILITY_LIST)
        .subscribe((res) => {
          if (res) {
            this.parksAndFacilities = res;
          }
        })
    );

    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.METRICS_FILTERS_PARAMS)
        .subscribe((res) => {
          if (res) {
            this.barChartData = null;
            this.doughnutData = null;
            this.singleFacility = false;
            this.filterParams = res;
            this.parseFilterParams();
          }
        })
    );

    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.CURRENT_METRICS)
        .subscribe((res) => {
          if (res) {
            this.metrics = res;
            this.parseFilterParams();
            this.parseMetrics();
          }
        })
    );

    this.subscriptions.add(
      loadingService.getLoadingStatus().subscribe((res) => {
        this.loading = res;
      })
    );
  }

  ngOnInit() {
    //set up chart settings
    this.doughnutOptions = {
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
    this.barChartOptions = {
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          intersect: false,
          mode: 'index',
        },
        legend: {
          labels: {
            font: {
              size: 20,
            },
          },
        },
      },
    };
    this.barChartPlugins = [ChartPlugins.barHighlightColumnPlugin];
  }

  parseFilterParams() {
    if (this.filterParams?.park) {
      if (this.filterParams?.park === 'all') {
        this.singleFacility = false;
        this.parkName = 'All Parks';
      } else {
        this.parkName = this.parksAndFacilities[this.filterParams.park]?.name;
        if (this.filterParams?.facility === 'all') {
          this.singleFacility = false;
          this.facilityName = 'All Facilities';
        } else {
          this.singleFacility = true;
          this.facilityName = this.parksAndFacilities[this.filterParams.park]?.facilities?.[this.filterParams.facility]?.name;
        }
      }
      if (this.filterParams?.dateRange) {
        this.dateRange = [this.filterParams.dateRange[0], this.filterParams.dateRange[1]];
        this.dateInterval = this.utils.createShortDateInterval(this.dateRange[0], this.dateRange[1]);
        this.noData = false;
      } else {
        this.noData = true;
      }
    }
  }

  parseMetrics() {
    if (this.metrics.length) {
      this.getStatusData();
      this.buildDoughnutChart(this.passTotals.active, this.passTotals.reserved, this.passTotals.expired, this.passTotals.cancelled);
      if (this.singleFacility && this.dateRange) {
        let capacityData = this.getCapacityData();
        this.buildBarChart(capacityData);
      } else {
        this.barChartData = null;
      }
    } else {
      this.barChartData = null;
      this.passTotals = {
        active: 0,
        reserved: 0,
        expired: 0,
        cancelled: 0,
        total: 0
      }
    }
  }

  getStatusData() {
    let statusData = {};
    this.passTotals = {
      active: 0,
      reserved: 0,
      expired: 0,
      cancelled: 0,
      total: 0
    }
    for (const metric of this.metrics) {
      this.passTotals.total += metric.totalPasses;
      let date = metric.sk;
      if (!statusData[date]) {
        statusData[date] = {
          active: 0,
          reserved: 0,
          expired: 0,
          cancelled: 0
        }
      }
      for (const time in metric.capacities) {
        for (const status in statusData[date]) {
          statusData[date][status] += metric.capacities[time].passStatuses?.[status] || 0;
        }
      }
    }
    for (const day in statusData) {
      this.passTotals.active += statusData[day].active;
      this.passTotals.reserved += statusData[day].reserved;
      this.passTotals.expired += statusData[day].expired;
      this.passTotals.cancelled += statusData[day].cancelled;
    }
  }

  getCapacityData() {
    let capacityData = {};
    for (const date of this.dateInterval) {
      capacityData[date] = {
        booked: 0,
        capacity: 0,
        cancelled: 0
      }
      const metricsList = this.metrics.filter((item) => item.sk === date);
      for (const metric of metricsList) {
        for (const time in metric.capacities) {
          const timeSlot = metric.capacities[time];
          capacityData[date].booked += timeSlot.baseCapacity + timeSlot.capacityModifier + timeSlot.overbooked - timeSlot.availablePasses;
          capacityData[date].capacity += timeSlot.baseCapacity + timeSlot.capacityModifier;
          capacityData[date].cancelled += timeSlot.passStatuses?.cancelled || 0;
        }
      }
    }
    return capacityData;
  }

  buildDoughnutChart(active, reserved, expired, cancelled) {
    const data = {
      active: active,
      reserved: reserved,
      expired: expired,
      cancelled: cancelled
    }

    this.doughnutLabels = Object.keys(data);
    if (this.passTotals.total > 0) {
      this.doughnutData = [
        {
          data: Object.values(data),
          backgroundColor: [
            '#75b343', //active
            '#205d38', //reserved
            '#fdb813', //expired
            '#E4E4E4', //cancelled
          ],
        }
      ]
    } else {
      this.doughnutData = null;
    }
  }

  buildBarChart(capacityData) {
    let data = {
      booked: [],
      capacity: [],
      cancelled: []
    }
    for (const item in capacityData) {
      data.booked.push(capacityData[item].booked);
      data.capacity.push(capacityData[item].capacity);
      data.cancelled.push(capacityData[item].cancelled);
    }

    this.barChartLabels = Object.keys(capacityData);
    this.barChartData = [
      {
        label: 'booked',
        data: data.booked,
        backgroundColor: '#C1D9F2', //active
      },
      {
        label: 'capacity',
        data: data.capacity,
        backgroundColor: '#2464A4', //reserved
      },
      {
        label: 'cancelled',
        data: data.cancelled,
        backgroundColor: '#003366', //cancelled
      },
    ]
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

  exportPassStatusData(){
    // TODO: write this
  }

  exportCapacityData() {
    return this.metricsService.generateCapacityReportCSV(this.metrics, this.filterParams);
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
