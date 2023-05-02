import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-passes-capacity-bar',
  templateUrl: './passes-capacity-bar.component.html',
  styleUrls: ['./passes-capacity-bar.component.scss'],
})
export class PassesCapacityBarComponent implements OnInit {
  private subscriptions = new Subscription();

  public data;

  constructor(dataService: DataService) {
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.CURRENT_CAPACITY_BAR_OBJECT)
        .subscribe((res) => {
          this.data = res;
        })
    );
  }

  ngOnInit(): void {}
}
