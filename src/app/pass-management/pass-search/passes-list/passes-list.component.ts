import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { PassService } from 'src/app/services/pass.service';
import { tableSchema } from 'src/app/shared/components/table/table.component';
import { Constants } from 'src/app/shared/utils/constants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { modalSchema } from 'src/app/shared/components/modal/modal.component';
import { KeycloakService } from 'src/app/services/keycloak.service';
import { DateTime } from 'luxon';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-passes-list',
  templateUrl: './passes-list.component.html',
  styleUrls: ['./passes-list.component.scss'],
})
export class PassesListComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  private subscriptions = new Subscription();
  public tableSchema: tableSchema;
  public passes: any[] = [];
  public tableRows: any[] = [];
  public passModal: modalSchema;
  public cancelModal: modalSchema;
  public passModalRef: BsModalRef;
  public cancelModalRef: BsModalRef;
  public lastEvaluatedKey = null;
  public rowSchema: any[];
  public dropDownSchema: any[];
  public checkedInStates: any[] = [{ value: 'all', label: 'All Passes' }, { value: 'checkedIn', label: 'Checked-in' }, { value: 'notCheckedIn', label: 'Not Checked-in' }];
  public checkedInState;
  public loading;

  @ViewChild('passModalTemplate') passModalTemplate: TemplateRef<any>;
  @ViewChild('cancelModalTemplate') cancelModalTemplate: TemplateRef<any>;
  @ViewChild('passStatusTemplate') passStatusTemplate: TemplateRef<any>;
  @ViewChild('passCheckedInTemplate') passCheckedInTemplate: TemplateRef<any>;
  @ViewChild('rowTemplate') rowTemplate: TemplateRef<any>;
  @ViewChild('passCancelButtonTemplate') passCancelButtonTemplate: TemplateRef<any>;
  @ViewChild('passIsOverbookedTemplate') passIsOverbookedTemplate: TemplateRef<any>;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setWidth();
  }

  constructor(
    protected dataService: DataService,
    protected keyCloakService: KeycloakService,
    protected passService: PassService,
    protected modalService: BsModalService,
    protected loadingService: LoadingService,
    protected cd: ChangeDetectorRef,
  ) {
    this.subscriptions.add(
      dataService.watchItem(Constants.dataIds.PASSES_LIST).subscribe((res) => {
        if (res) {
          this.passes = res;
          this.changeCheckInState({ value: this.checkedInState }, true);
        }
      })
    );
    this.subscriptions.add(
      loadingService.getLoadingStatus().subscribe((res) => {
        this.loading = res;
      })
    );
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.PASS_LAST_EVALUATED_KEY)
        .subscribe((res) => {
          this.lastEvaluatedKey = res;
        })
    );
  }

  ngOnInit(): void {
    this.checkedInState = 'all'
  }

  setWidth() {
    let columns = [...this.rowSchema];
    // don't forget about the cancel button column
    columns.push({ id: 'cancelButton' });
    // get groups of column ids
    for (const col of columns) {
      const columns = document.querySelectorAll<HTMLElement>(`#${col.id}`);
      let maxWidth = 0;
      for (let i = 0; i < columns.length; i++) {
        maxWidth = Math.max(maxWidth, columns[i].scrollWidth);
      }
      for (let i = 0; i < columns.length; i++) {
        columns[i].style.width = maxWidth + 'px';
      }
    }
  }

  ngAfterViewInit() {
    this.rowSchema = [
      {
        id: 'passId', // column identifier
        displayHeader: 'Res Number', // table header display name
        dropdown: 0, // when does this column collapse into the dropdown? 0-never, 1-mobile, 2<xs, 3<sm, 4<md, 5<lg, 6<xl, 7-always
        columnClasses: 'col-sm-auto col-3', // additional column classes - for column sizing at different screen sizes
        grow: false, // if true, column grows to fill available space. if false, column is minimum width
        key: 'registrationNumber' // value of pass object associated with column
      },
      {
        id: 'numberOfGuests',
        dropdown: 4,
        grow: false,
        columnClasses: 'col-auto',
        displayHeader: 'Passes',
        key: 'numberOfGuests'
      },
      {
        id: 'date',
        dropdown: 0,
        grow: false,
        columnClasses: 'col-sm-auto col-3',
        displayHeader: 'Date',
        key: 'shortPassDate'
      },
      {
        id: 'email',
        dropdown: 3,
        columnClasses: 'col',
        grow: true,
        displayHeader: 'Email',
        key: 'email'
      },
      {
        id: 'name',
        displayHeader: 'Name',
        columnClasses: 'col',
        dropdown: 5,
        grow: true,
        key: 'lastName',
        display: (pass) => `${pass.firstName} ${pass.lastName}`
      },
      {
        id: 'status',
        displayHeader: 'Status',
        columnClasses: 'col-auto',
        dropdown: 2,
        grow: false,
        key: 'passStatus',
        template: this.passStatusTemplate
      },
      {
        id: 'checkedIn',
        dropdown: 2,
        columnClasses: 'col-auto',
        grow: false,
        displayHeader: 'Checked-in',
        key: 'checkedIn',
        template: this.passCheckedInTemplate
      },
      {
        id: 'isOverbooked',
        dropdown: 3,
        columnClasses: 'col-auto',
        grow: false,
        key: 'isOverbooked',
        template: this.passIsOverbookedTemplate
      },
      {
        id: 'park',
        displayHeader: 'Park',
        grow: false,
        dropdown: 7,
        key: 'parkName',
      },
      {
        id: 'facility',
        displayHeader: 'Facility',
        grow: false,
        dropdown: 7,
        key: 'facilityName',
      },
      {
        id: 'passType',
        displayHeader: 'Pass Type',
        grow: false,
        dropdown: 7,
        key: 'type',
      },
      {
        id: 'checkInTime',
        displayHeader: 'Check-in Time',
        grow: false,
        dropdown: 7,
        key: 'checkedInTime',
        display: (pass) => this.formatCheckedInTime(pass),
      },
    ];
    this.setWidth();
    this.cd.detectChanges();
  }

  ngAfterViewChecked() {
    this.setWidth();
  }

  changeCheckInState(state, forceUpdate = false) {
    this.loadingService.addToFetchList(Constants.dataIds.FILTERED_PASSES_LIST);
    this.tableRows = this.passes;
    if (state === undefined) {
      state = this.checkedInStates[0];
      this.checkedInState = state.value
    }
    if (state?.value !== this.checkedInState || forceUpdate === true) {
      this.checkedInState = state.value;
      // filter current passList
      if (this.passes?.length) {
        switch (state.value) {
          case 'checkedIn':
            this.tableRows = [];
            for (const row of this.passes) {
              if (row?.checkedIn) {
                this.tableRows.push(row);
              }
            }
            break;
          case 'notCheckedIn':
            this.tableRows = [];
            for (const row of this.passes) {
              if (!row?.checkedIn || row?.checkedIn === false) {
                this.tableRows.push(row);
              }
            }
            break;
          case 'all':
          default:
            this.tableRows = this.passes;
            break;
        }
      }
      this.loadingService.removeToFetchList(Constants.dataIds.FILTERED_PASSES_LIST);
      this.dataService.setItemValue(Constants.dataIds.FILTERED_PASSES_LIST, this.tableRows);
      this.updateCapacityBarCheckIns();
    }
  }

  formatCheckedInTime(pass) {
    if (pass?.checkedInTime) {
      const time = DateTime.fromISO(pass?.checkedInTime).setZone('America/Vancouver');
      return time.toLocaleString(DateTime.DATETIME_SHORT);
    }
    return 'N/A';
  }

  cancelPass(pass) {
    const parkSk = pass.pk.split('::')[1];
    this.passService.cancelPasses(pass.sk, parkSk);
  }

  disableCancelButton(pass) {
    if (pass.passStatus === 'cancelled' || pass.passStatus === 'expired') {
      return true;
    }
    return false;
  }

  isAllowed(method) {
    return this.keyCloakService.isAllowed(method);
  }

  loadMorePasses() {
    let loadMoreObj = this.dataService.mergeItemValue(
      Constants.dataIds.PASS_SEARCH_PARAMS,
      {
        ExclusiveStartKeyPK: this.lastEvaluatedKey?.pk?.S,
        ExclusiveStartKeySK: this.lastEvaluatedKey?.sk?.S,
        appendResults: true,
      }
    );
    this.passService.fetchData(loadMoreObj);
  }

  displayCancelModal(passObj) {
    const self = this;
    this.cancelModal = {
      id: 'cancelModal',
      title: 'Cancel Pass',
      body: this.constructCancelPassModal(passObj),
      buttons: [
        {
          text: 'Cancel Pass',
          classes: 'btn btn-danger',
          onClick: function () {
            self.cancelPass(passObj);
            self.cancelModalRef.hide();
          },
        },
      ],
    };
    this.cancelModalRef = this.modalService.show(this.cancelModalTemplate, {
      class: 'modal-lg',
    });
  }

  constructCancelPassModal(passObj) {
    let message = `<p>You are about to cancel pass <strong>${passObj.registrationNumber}</strong>.</div>`;
    message += `<p>Are you sure you want to continue?</p>`;
    return message;
  }

  updateCapacityBarCheckIns() {
    let checkInCount = 0;
    if (this.passes) {
      for (const pass of this.passes) {
        if (pass.checkedIn) {
          checkInCount += pass.numberOfGuests;
        }
      }
    }
    // merge the checkInCount to the current capacity bar object
    this.dataService.mergeItemValue(Constants.dataIds.CURRENT_CAPACITY_BAR_OBJECT, { checkInCount: checkInCount });
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
