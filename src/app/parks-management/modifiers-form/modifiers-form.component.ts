import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModifierService } from 'src/app/services/modifier.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-modifiers-form',
  templateUrl: './modifiers-form.component.html',
  styleUrls: ['./modifiers-form.component.scss'],
})
export class ModifiersFormComponent extends BaseFormComponent implements OnInit {
  @Input() facility;
  @Input() park;

  public today;
  public hasAM = new BehaviorSubject(false);
  public hasPM = new BehaviorSubject(false);
  public hasDAY = new BehaviorSubject(false);

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected formService: FormService,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef,
    private modifierService: ModifierService
  ) {
    super(
      formBuilder,
      formService,
      router,
      dataService,
      loadingService,
      changeDetector
    );
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.CURRENT_FACILITY)
        .subscribe((res) => {
          if (res && res[0]) {
            this.facility = res[0];
            this.setBookingTimes();
            this.setForm();
          }
        })
    );
    this.setForm();
  }

  ngOnInit(): void {
    this.today = new Date();
  }

  setBookingTimes() {
    if (this.facility.bookingTimes?.AM) {
      this.hasAM.next(true);
    } else {
      this.hasAM.next(false);
    }
    if (this.facility.bookingTimes?.PM) {
      this.hasPM.next(true);
    } else {
      this.hasPM.next(false);
    }
    if (this.facility.bookingTimes?.DAY) {
      this.hasDAY.next(true);
    } else {
      this.hasDAY.next(false);
    }
  }

  checkModifierSubmission() {
    if (
      !this.fields.modifierOverrideDate.value ||
      (!this.fields.modifierAMChanges.value &&
        this.fields.modifierPMChanges.value &&
        !this.fields.modifierDAYChanges.value)
    ) {
      return true;
    }
    return false;
  }

  setForm() {
    this.form = new UntypedFormGroup({
      modifierOverrideDate: new UntypedFormControl(null),
      modifierAMChanges: new UntypedFormControl(null),
      modifierPMChanges: new UntypedFormControl(null),
      modifierDAYChanges: new UntypedFormControl(null),
    });
    this.fields = {
      modifierOverrideDate: this.form.get('modifierOverrideDate'),
      modifierAMChanges: this.form.get('modifierAMChanges'),
      modifierPMChanges: this.form.get('modifierPMChanges'),
      modifierDAYChanges: this.form.get('modifierDAYChanges'),
    };

    super.addDisabledRule(this.fields.modifierAMChanges, this.hasAM, [false]);
    super.addDisabledRule(this.fields.modifierPMChanges, this.hasPM, [false]);
    super.addDisabledRule(this.fields.modifierDAYChanges, this.hasDAY, [false]);

  }

  async onSubmit() {
    let res = await super.submit();
    const postObj = this.formatFormResults(res.fields);
    this.modifierService.setModifier(postObj);
  }

  formatFormResults(results) {
    let resultTimes = {};
    if (results.modifierAMChanges) {
      resultTimes['AM'] = results.modifierAMChanges;
    }
    if (results.modifierPMChanges) {
      resultTimes['PM'] = results.modifierPMChanges;
    }
    if (results.modifierDAYChanges) {
      resultTimes['DAY'] = results.modifierDAYChanges;
    }
    const postObj = {
      date: results.modifierOverrideDate,
      bookingTimes: resultTimes,
      parkName: this.park.sk,
      facility: this.facility.sk,
    };

    return postObj;
  }
}
