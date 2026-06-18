import { Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-text-to-loading-spinner',
    templateUrl: './text-to-loading-spinner.component.html',
    styleUrls: ['./text-to-loading-spinner.component.scss'],
    standalone: true
})
export class TextToLoadingSpinnerComponent implements OnDestroy {
  protected loadingService = inject(LoadingService);

  @Input() text;
  @Output() loadingStatus: EventEmitter<boolean> = new EventEmitter();

  private subscriptions = new Subscription();

  public loading = false;

  constructor() {
    const loadingService = this.loadingService;

    this.subscriptions.add(
      loadingService.getLoadingStatus().subscribe((res) => {
        this.loading = res;
        this.loadingStatus.emit(res);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
