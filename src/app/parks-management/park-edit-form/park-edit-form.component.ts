import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { LoadingService } from 'src/app/services/loading.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-park-edit-form',
  templateUrl: './park-edit-form.component.html',
  styleUrls: ['./park-edit-form.component.scss'],
})
export class ParkEditFormComponent extends BaseFormComponent {
  public park;
  public isEditMode = new BehaviorSubject<boolean>(true);

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected formService: FormService,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef
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
      dataService.watchItem(Constants.dataIds.CURRENT_PARK).subscribe((res) => {
        if (res && res[0]) {
          this.park = res[0];
          this.data = this.park;
          this.setForm();
        }
      })
    );
    this.initializeForm();
  }

  initializeForm() {
    // First pass of form initialization, establish disabledRules (if any)
    this.setForm();
    // Disabling rules:
    super.addDisabledRule(this.fields.parkName, this.isEditMode, [true]);
    super.addDisabledRule(this.fields.parkOrcs, this.isEditMode, [true]);
  }

  setForm() {
    this.form = new UntypedFormGroup({
      parkName: new UntypedFormControl(this.data.name, Validators.required),
      parkOrcs: new UntypedFormControl(this.data.orcs, Validators.required),
      parkStatus: new UntypedFormControl(
        this.data.status === 'open' ? true : false
      ),
      parkVisibility: new UntypedFormControl(this.data.visible),
      parkCapacity: new UntypedFormControl(this.data.capacity),
      parkSiteLink: new UntypedFormControl(this.data.bcParksLink),
      parkMapLink: new UntypedFormControl(this.data.mapLink),
      parkDescription: new UntypedFormControl(this.data.description),
    });
    super.setFields();
  }

  async onSubmit() {
    const res = await super.submit();
    if (res.invalidControls.length === 0) {
      const postObj = this.formatFormResults(res.fields);
    }
  }

  // Format form fields for API submission
  formatFormResults(results) {
    const postObj = {
      park: {
        name: results.parkName,
        orcs: results.parkOrcs,
        bcParksLink: results.parkSiteLink,
        mapLink: results.parkMapLink,
        status: results.parkStatus === true ? 'open' : 'closed',
        capacity: results.parkCapacity,
      },
      description: results.parkDescription,
      visible: results.parkVisibility,
    };
    return postObj;
  }
}
