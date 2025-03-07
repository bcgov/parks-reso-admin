import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-infinite-loading-bar',
    templateUrl: './infinite-loading-bar.component.html',
    styleUrls: ['./infinite-loading-bar.component.scss'],
    imports: [NgIf]
})
export class InfiniteLoadingBarComponent implements OnDestroy {
  private subscriptions = new Subscription();

  public loading = false;

  constructor(protected loadingService: LoadingService) {
    this.subscriptions.add(
      loadingService.getLoadingStatus().subscribe((res) => {
        this.loading = res;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
