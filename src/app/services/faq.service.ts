import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../shared/utils/constants';
import { ApiService } from './api.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { LoggerService } from './logger.service';
import { ToastService, ToastTypes } from './toast.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  constructor(
    private apiService: ApiService,
    private eventService: EventService,
    private loggerService: LoggerService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async fetchData() {
    let errorSubject = '';
    let res;

    try {
      this.loggerService.debug(`faq GET: GET THE FAQ`);
      res = (
        await firstValueFrom(this.apiService.get('faq', { faq: 'faq' }))
      )[0];

      if (res?.text) {
        return res.text;
      } else {
        throw new Error('Invalid response object or missing "text" property.');
      }
    } catch (e) {
      this.loggerService.error(`${JSON.stringify(e)}`);
      this.toastService.addMessage(
        `An error has occurred while getting ${errorSubject}.`,
        'FAQ Service',
        Constants.ToastTypes.ERROR
      );
      return 'ERROR!';
    }
  }

  async putFaq(obj) {
    let errorSubject = '';
    try {
      errorSubject = 'Faq put';
      if (this.validateFaqObject(obj)) {
        obj.pk = 'faq';
        obj.sk = 'faq';
        this.loggerService.debug(`Put FAQ: ${JSON.stringify(obj)}`);
        await firstValueFrom(this.apiService.put('faq', obj));
        this.toastService.addMessage(
          ``,
          `Your changes were saved.`,
          ToastTypes.SUCCESS
        );
      }
    } catch (e) {
      this.loggerService.error(`${JSON.stringify(e)}`);
      this.toastService.addMessage(
        ``,
        `Something went wrong. Please try again.`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'FAQ ERROR')
      );
    }
  }
  validateFaqObject(obj){
    //If Validation Requirements come later on validate here
    return true
  }
}