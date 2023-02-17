import { Component, OnDestroy } from '@angular/core';
import { skip, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { QrScannerService } from 'src/app/shared/components/qr-scanner/qr-scanner.service';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-qr-result',
  templateUrl: './qr-result.component.html',
  styleUrls: ['./qr-result.component.scss'],
})
export class QrResultComponent implements OnDestroy {
  private subscriptions = new Subscription();

  public passes = [];

  constructor(
    private dataService: DataService,
    private qrScannerService: QrScannerService
  ) {
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.PASS_CHECK_IN_LIST_EVENT)
        .pipe(skip(1))
        .subscribe((res) => {
          if (res) {
            this.returnToScanner();
          }
        })
    );
  }

  returnToScanner() {
    // clear list.
    this.dataService.setItemValue(Constants.dataIds.PASS_CHECK_IN_LIST, []);
    this.qrScannerService.enableScanner();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
