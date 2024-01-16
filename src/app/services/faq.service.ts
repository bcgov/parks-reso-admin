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
        await firstValueFrom(this.apiService.get('readfaq', { faq: 'faq' }))
      )[0];

      if (res?.text) {
        console.log("Valid response with 'text' property:", res.text);
        return res.text;
      } else {
        console.log("Throwing error!");
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
    let res;
    let errorSubject = '';
    try {
      errorSubject = 'Faq put';
      if (this.validateFaqObject(obj)) {
        console.log("VALIDATED");
        obj.pk = 'faq';
        obj.sk = 'faq';
        this.loggerService.debug(`Put FAQ: ${JSON.stringify(obj)}`);
        await firstValueFrom(this.apiService.put('writefaq', obj));
        this.toastService.addMessage(
          `Park: ${obj.sk} updated.`,
          `Park updated`,
          ToastTypes.SUCCESS
        );
      }
    } catch (e) {
      this.loggerService.error(`${JSON.stringify(e)}`);
      this.toastService.addMessage(
        `There was a problem updating the FAQ.`,
        `Error putting ${errorSubject}`,
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