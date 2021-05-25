import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { TableObject } from 'app/shared/components/table-template/table-object';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  public numProjects: number = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  public tableData: TableObject = new TableObject();

  constructor(
  ) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
