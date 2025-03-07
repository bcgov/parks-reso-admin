import {
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ParkService } from 'src/app/services/park.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { modalSchema } from 'src/app/shared/components/modal/modal.component';
import { Constants } from 'src/app/shared/utils/constants';
import { Utils } from 'src/app/shared/utils/utils';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { WysiwygInputComponent } from '../../shared/components/ds-forms/wysiwyg-input/wysiwyg-input.component';
import { TextInputComponent } from '../../shared/components/ds-forms/text-input/text-input.component';
import { ToggleComponent } from '../../shared/components/ds-forms/toggle/toggle.component';
import { FancyHeaderComponent } from '../../shared/components/fancy-header/fancy-header.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-park-edit-form',
    templateUrl: './park-edit-form.component.html',
    styleUrls: ['./park-edit-form.component.scss'],
    imports: [
        NgIf,
        FancyHeaderComponent,
        FormsModule,
        ToggleComponent,
        TextInputComponent,
        WysiwygInputComponent,
        ModalComponent,
    ]
})
export class ParkEditFormComponent extends BaseFormComponent {
  public park;
  public isEditMode = new BehaviorSubject<boolean>(true);
  public parkEditModal: modalSchema;
  public parkEditModalRef: BsModalRef;
  private utils = new Utils();

  @ViewChild('parkEditConfirmationTemplate')
  parkEditConfirmationTemplate: TemplateRef<any>;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef,
    private parkService: ParkService,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {
    super(formBuilder, router, dataService, loadingService, changeDetector);
    this.subscriptions.add(
      dataService.watchItem(Constants.dataIds.CURRENT_PARK_KEY).subscribe((res) => {
        if (res) {
          this.park = this.parkService.getCachedPark(res);
          this.data = this.park;
          this.setForm();
        }
      })
    );
    this.setForm();
  }

  setForm() {
    this.form = new UntypedFormGroup({
      parkName: new UntypedFormControl(this.data.name, Validators.required),
      parkOrcs: new UntypedFormControl(this.data.orcs, Validators.required),
      parkStatus: new UntypedFormControl(
        this.data.status === 'open' ? true : false
      ),
      parkVisibility: new UntypedFormControl(this.data.visible),
      parkSpecialClosure: new UntypedFormControl(this.data.specialClosure),
      parkCapacity: new UntypedFormControl(this.data.capacity),
      parkSiteLink: new UntypedFormControl(
        this.data.bcParksLink,
        Validators.required
      ),
      parkMapLink: new UntypedFormControl(this.data.mapLink),
      parkVideoLink: new UntypedFormControl(this.data.videoLink),
      parkDescription: new UntypedFormControl(this.data.description),
      parkSpecialClosureText: new UntypedFormControl(this.data.specialClosureText),
    });
    super.updateForm();
    super.addDisabledRule(this.fields.parkOrcs);
    super.addDisabledRule(this.fields.parkName);
  }

  async onSubmit() {
    const res = await super.submit();
    if (res.invalidControls.length === 0) {
      const postObj = this.formatFormResults(res.fields);
      this.displayConfirmationModal(postObj);
    }
  }

  submitParkChanges(postObj) {
    this.parkService.putPark(postObj, true, true);
    this.navigateBack();
  }

  onFormReset() {
    super.reset();
    this.setForm();
  }

  // Format form fields for API submission
  formatFormResults(results) {
    const postObj = {
      park: {
        name: results.parkName,
        orcs: results.parkOrcs,
        bcParksLink: results.parkSiteLink,
        mapLink: results.parkMapLink,
        videoLink: results.parkVideoLink,
        status: results.parkStatus === true ? 'open' : 'closed',
        capacity: results.parkCapacity,
        specialClosure: results.parkSpecialClosure,
        specialClosureText: results.parkSpecialClosureText,
      },
      description: results.parkDescription,
      visible: results.parkVisibility,
    };
    return postObj;
  }

  displayConfirmationModal(parkObj) {
    const self = this;
    this.parkEditModal = {
      id: 'parkEditModal',
      title: 'Confirm Park Details:',
      body: this.constructParkEditModalBody(parkObj),
      buttons: [
        {
          text: 'Cancel',
          classes: 'btn btn-outline-secondary',
          onClick: function () {
            self.parkEditModalRef.hide();
          },
        },
        {
          text: 'Confirm',
          classes: 'btn btn-primary',
          onClick: function () {
            self.submitParkChanges(parkObj);
            self.parkEditModalRef.hide();
          },
        },
      ],
    };
    this.parkEditModalRef = this.modalService.show(
      this.parkEditConfirmationTemplate,
      {
        class: 'modal-lg',
      }
    );
  }

  constructParkEditModalBody(parkObj) {
    let statusMsg = '';
    if (parkObj.park?.status === 'open') {
      statusMsg += `Open (passes required)`;
    } else {
      statusMsg += `Closed (passes not required)`;
    }
    let message = this.utils.buildInnerHTMLRow([
      `<strong>Name:</strong></br>` + parkObj.park?.name,
      `<strong>Status:</strong></br>` + statusMsg,
    ]);
    let visibleMsg = '';
    if (parkObj.visible) {
      visibleMsg += `Visible to public`;
    } else {
      visibleMsg += `Not visible to public`;
    }
    message += this.utils.buildInnerHTMLRow([
      `<strong>Visibility:</strong></br>` + visibleMsg,
      `<strong>Capacity:</strong></br>` + parkObj.park?.capacity,
    ]);
    message +=
      `<strong>Link to BC Parks Site:</strong></br>` +
      parkObj.park?.bcParksLink;
    message +=
      `</br></br><strong>Link to map:</strong></br>` + parkObj.park?.mapLink;
    message +=
    `</br></br><strong>Link to video:</strong></br>` + parkObj.park?.videoLink;
    message +=
      `</br></br><strong>Description:</strong></br>` + parkObj.description;
    if(parkObj.park?.specialClosureText){
      message += `</br><strong>Special Closure Text: </strong></br>` + parkObj.park?.specialClosureText;
    }
      return message;
  }

  testParkSiteLink(event) {
    event.preventDefault();
    window.open(this.fields.parkSiteLink.value, '_blank');
  }

  testMapLink(event) {
    event.preventDefault();
    window.open(this.fields.parkMapLink.value);
  }

  testVideoLink(event) {
    event.preventDefault();
    window.open(this.fields.parkVideoLink.value);
  }

  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
