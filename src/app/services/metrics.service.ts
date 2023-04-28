import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { Constants } from "../shared/utils/constants";
import { ApiService } from "./api.service";
import { DataService } from "./data.service";
import { EventKeywords, EventObject, EventService } from "./event.service";
import { LoadingService } from "./loading.service";
import { ToastService, ToastTypes } from "./toast.service";
import { Utils } from "../shared/utils/utils";
import { LoggerService } from "./logger.service";

@Injectable({
  providedIn: 'root',
})
export class MetricsService {

  public utils = new Utils();

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private toastService: ToastService,
    private eventService: EventService,
    private loadingService: LoadingService,
    private loggerService: LoggerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  async fetchData(startDate, endDate?, parkSk?, facilitySk?): Promise<any> {
    const errorSubject = 'metrics';
    const dataTag = Constants.dataIds.CURRENT_METRICS;
    const parksAndFacilities = this.dataService.getItemValue(Constants.dataIds.PARK_AND_FACILITY_LIST);

    let parkList = [];
    let getList = [];

    if (!parkSk) {
      // Get from all parks
      parkList = Object.keys(parksAndFacilities);
    } else {
      // Get from 1 park
      parkList = [parkSk]
    }

    for (const park of parkList) {
      if (!facilitySk) {
        // Get from all facilities in park
        getList[park] = Object.keys(parksAndFacilities[park].facilities);
      } else {
        // Get from 1 facility
        getList[park] = [facilitySk];
      }
    }

    try {
      this.loadingService.addToFetchList(dataTag); 0
      let data = [];
      this.dataService.setItemValue(dataTag, null);
      for (const item in getList) {
        for (const facility of getList[item]) {
          const res = await firstValueFrom(
            this.apiService.get(
              'metrics',
              {
                park: item,
                facility: facility,
                startDate: startDate,
                endDate: endDate || null
              }));
          data = data.concat(res);
        }
      }
      this.dataService.setItemValue(dataTag, data);
    } catch (e) {
      this.toastService.addMessage(
        `An error has occured while getting ${errorSubject}.`,
        'Metrics Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, e as string, 'Metrics Service')
      );
      this.router.navigate(['../']);
    }
    this.loadingService.removeToFetchList(dataTag);
  }

  /**
   *   fields should have the following format at minimum: 
   * fields = {
   * park: park,
   * facility: facility,
   * dateRange: [startDate, endDate]
   * timeSpan: timeSpan,
   * }
   */
  setFilterParams(fields) {
    this.dataService.setItemValue(Constants.dataIds.METRICS_FILTERS_PARAMS, fields);
  }

  generateCapacityReportCSV(metricsList, metricsParams) {
    const { park, facility, dateRange } = metricsParams;
    try {
      if (!this.validateMetricsParams(metricsParams, true)) {
        // no capacity reports spanning multiple facilities (yet)
        throw 'Invalid parameters. Please ensure only 1 facility is selected.'
      }
      if (!metricsList || !metricsList.length) {
        throw 'No data to be exported.';
      }
      // Get park name - we can assume all metrics in the list are from the same park as the capacity data in this report is not very useful otherwise.
      // This may have to change later.
      const parkName = this.dataService.getItemValue(Constants.dataIds.PARK_AND_FACILITY_LIST)[park].name;
      const dateInterval = this.utils.createShortDateInterval(dateRange[0], dateRange[1]);
      let content = [['Park', 'Facility', 'Date', 'Status', 'AM base capacity', 'AM capacity modifier', 'AM total passes', 'AM booked passes', 'AM cancellations', 'PM base capacity', 'PM capacity modifier', 'PM total passes', 'PM booked passes', 'PM cancellations', 'All-Day base capacity', 'All-Day capacity modifier', 'All-Day total passes', 'All-Day booked passes', 'All-Day cancellations']];
      for (const date of dateInterval) {
        let metric = metricsList.find((item) => item.sk === date);
        content.push([parkName, facility, date,
          'N/A', // TODO: update metrics to include open/closed status
          metric?.capacities?.AM?.baseCapacity ?? 'N/A',
          metric?.capacities?.AM?.capacityModifier ?? 'N/A',
          isNaN(metric?.capacities?.AM?.baseCapacity + metric?.capacities?.AM?.capacityModifier) ?
            'N/A' : metric?.capacities?.AM?.baseCapacity + metric?.capacities?.AM?.capacityModifier,
          isNaN(metric?.capacities?.AM?.baseCapacity + metric?.capacities?.AM?.capacityModifier - metric?.capacities?.AM?.availablePasses) ?
            'N/A' : metric?.capacities?.AM?.baseCapacity + metric?.capacities?.AM?.capacityModifier - metric?.capacities?.AM?.availablePasses,
          metric?.capacities?.AM?.passStatuses?.cancelled ?? 'N/A',
          metric?.capacities?.PM?.baseCapacity ?? 'N/A',
          metric?.capacities?.PM?.capacityModifier ?? 'N/A',
          isNaN(metric?.capacities?.PM?.baseCapacity + metric?.capacities?.PM?.capacityModifier) ?
            'N/A' : metric?.capacities?.PM?.baseCapacity + metric?.capacities?.PM?.capacityModifier,
          isNaN(metric?.capacities?.PM?.baseCapacity + metric?.capacities?.PM?.capacityModifier - metric?.capacities?.PM?.availablePasses) ?
            'N/A' : metric?.capacities?.PM?.baseCapacity + metric?.capacities?.PM?.capacityModifier - metric?.capacities?.PM?.availablePasses,
          metric?.capacities?.PM?.passStatuses?.cancelled ?? 'N/A',
          metric?.capacities?.DAY?.baseCapacity ?? 'N/A',
          metric?.capacities?.DAY?.capacityModifier ?? 'N/A',
          isNaN(metric?.capacities?.DAY?.baseCapacity + metric?.capacities?.DAY?.capacityModifier) ?
            'N/A' : metric?.capacities?.DAY?.baseCapacity + metric?.capacities?.DAY?.capacityModifier,
          isNaN(metric?.capacities?.DAY?.baseCapacity + metric?.capacities?.DAY?.capacityModifier - metric?.capacities?.DAY?.availablePasses) ?
            'N/A' : metric?.capacities?.DAY?.baseCapacity + metric?.capacities?.DAY?.capacityModifier - metric?.capacities?.DAY?.availablePasses,
          metric?.capacities?.DAY?.passStatuses?.cancelled ?? 'N/A',
        ]);
      }
      let csvData = '';
      for (const csvRow of content) {
        csvData += csvRow.join(',') + "\r\n";
      };
      const fileName = 'capacityReport_' + Math.random().toString().substring(2, 10);
      this.utils.downloadCSV(fileName, csvData);
    } catch (error) {
      this.loggerService.error(`${JSON.stringify(error)}`);
      this.toastService.addMessage(
        `Error downloading .csv`,
        `${error}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(error), 'Metrics Service')
      );
    }
  }

  // set enforceSingleFacility to true if park === 'all' or facility === 'all' is not permitted.
  validateMetricsParams(params, enforceSingleFacility = false): boolean {
    if (
      !params?.park ||
      !params?.dateRange
    ) {
      return false;
    }
    if (enforceSingleFacility) {
      if (
        !params?.facility ||
        params?.park === 'all' ||
        params?.facility === 'all'
      ) {
        return false;
      }
    } else {
      if (params.park !== 'all' && !params.facility) {
        return false;
      }
    }
    return true;
  }
}
