import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { Constants } from "../shared/utils/constants";
import { ApiService } from "./api.service";
import { DataService } from "./data.service";
import { EventKeywords, EventObject, EventService } from "./event.service";
import { LoadingService } from "./loading.service";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: 'root',
})
export class MetricsService {
  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private toastService: ToastService,
    private eventService: EventService,
    private loadingService: LoadingService,
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
        'Pass Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, e as string, 'Metrics Service')
      );
      this.router.navigate(['../', { relativeTo: this.route }]);
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

}
