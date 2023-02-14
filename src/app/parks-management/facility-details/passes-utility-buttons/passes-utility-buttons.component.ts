import { Component, OnDestroy } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { PassService } from 'src/app/services/pass.service';
import { ToastService } from 'src/app/services/toast.service';
import { Constants } from 'src/app/shared/utils/constants';
import { PassUtils } from 'src/app/utils/pass-utils';
import { DateTime } from 'luxon';
import { KeycloakService } from 'src/app/services/keycloak.service';

@Component({
  selector: 'app-passes-utility-buttons',
  templateUrl: './passes-utility-buttons.component.html',
  styleUrls: ['./passes-utility-buttons.component.scss'],
})
export class PassesUtilityButtonsComponent implements OnDestroy {
  private subscriptions = new Subscription();
  public facility;
  private parkSk;
  private passFilterParams;

  public passes;

  constructor(
    protected apiService: ApiService,
    protected toastService: ToastService,
    protected dataService: DataService,
    protected keyCloakService: KeycloakService,
    protected passService: PassService
  ) {
    this.subscriptions.add(
      dataService.watchItem(Constants.dataIds.PASSES_LIST).subscribe((res) => {
        this.passes = res;
      })
    );

    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.CURRENT_FACILITY)
        .subscribe((res) => {
          if (res) {
            this.facility = res;
            this.parkSk = this.facility.pk.split('::')[1];
          }
        })
    );

    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.PASS_SEARCH_PARAMS)
        .subscribe((res) => {
          this.passFilterParams = res;
        })
    );
  }

  isAllowed(buttonFunction) {
    if (buttonFunction === 'exportCsv') {
      return this.keyCloakService.isAllowed('export-reports');
    } else {
      return false;
    }
  }

  async exportCsv() {
    try {
      let obj = {
        facilityName: this.facility.sk,
        park: this.parkSk,
        email: this.passFilterParams['email'],
        date: this.passFilterParams['date'],
        firstName: this.passFilterParams['firstName'],
        lastName: this.passFilterParams['lastName'],
        passStatus: this.passFilterParams['passStatus'],
        reservationNumber: this.passFilterParams['reservationNumber'],
      };
      Object.keys(obj).forEach((key) =>
        obj[key] === undefined ? delete obj[key] : {}
      );
      const res = await firstValueFrom(this.apiService.get('export-pass', obj));
      window.open(res.signedURL, '_blank')?.focus();
    } catch (e) {
      this.toastService.addMessage(
        'Failed Exporting Passes:' + e,
        'Export Passes',
        Constants.ToastTypes.ERROR
      );
    }
  }

  print(): void {
    const printContent = document.getElementById('print-area');
    const WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0'
    );
    if (WindowPrt && printContent) {
      WindowPrt.document.write(
        `<style>
          table {
              border-collapse: collapse;
              width: 100%;
          }
          td,
          th {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
          }
        </style>`
      );
      WindowPrt.document.write(
        `<h4>${this.passFilterParams['passType']} passes for ${this.facility.name}</h4>`
      );
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
      WindowPrt.close();
    }
  }

  copyEmails(): void {
    PassUtils.copyEmailToClipboard(this.passes);
    this.toastService.addMessage(
      'Emails copied to clipboard.',
      'Copy Emails',
      Constants.ToastTypes.SUCCESS
    );
  }

  convertDate(date) {
    return DateTime.fromISO(date).toISODate();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
