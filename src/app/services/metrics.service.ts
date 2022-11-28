import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../shared/utils/constants';
import { ApiService } from './api.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';
import { firstValueFrom } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class MetricsService {
  constructor(
    private apiService: ApiService,
    private eventService: EventService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private dataService: DataService
  ) {}

  async fetchData(metric): Promise<any> {
    const errorSubject = 'metrics';
    const dataTag = Constants.dataIds.PASS_BREAKDOWN_BY_STATUS;

    try {
      this.loadingService.addToFetchList(dataTag);
      const res = await firstValueFrom(
        this.apiService.get('metric', { type: metric })
      );
      this.dataService.setItemValue(dataTag, res);
    } catch (e) {
      this.toastService.addMessage(
        `An error has occured while getting ${errorSubject}.`,
        'Pass Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, e as string, 'Metric Service')
      );
      this.router.navigate(['../', { relativeTo: this.route }]);
    }
    this.loadingService.removeToFetchList(dataTag);
  }
}
