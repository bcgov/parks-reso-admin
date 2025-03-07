import {
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { FaqService } from 'src/app/services/faq.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { modalSchema } from 'src/app/shared/components/modal/modal.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { WysiwygInputComponent } from '../../shared/components/ds-forms/wysiwyg-input/wysiwyg-input.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-faq-edit',
    templateUrl: './faq-edit.component.html',
    styleUrls: ['./faq-edit.component.scss'],
    imports: [
        FormsModule,
        NgIf,
        WysiwygInputComponent,
        ModalComponent,
    ]
})
//reput implements on innit
export class FaqEditComponent extends BaseFormComponent implements OnInit {
  public faqData : any;
  public sanityCheck : any;
  public faqEditModal: modalSchema;
  public faqEditModalRef: BsModalRef;

  @ViewChild('faqEditTemplate')
  faqEditTemplate: TemplateRef<any>;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef,
    private faqService: FaqService,
    private route: ActivatedRoute,
    private modalService: BsModalService
    ) {
    super(formBuilder, router, dataService, loadingService, changeDetector);
  }
 async ngOnInit() {
    const data = await this.faqService.fetchData()
    this.faqData = data;
    this.setForm(); 
  }

  setForm() {
      this.form = new UntypedFormGroup({
      wysiwygFaq: new UntypedFormControl(this.faqData),
    });
    super.updateForm();
  }

  onSubmit() {
    this.displayConfirmationModal();
  }

  displayConfirmationModal() {
    const self = this;
    this.faqEditModal = {
      id: 'faqEditModal',
      title: 'Confirm Facility Details:',
      body: "Are you sure you want to update the Day Use Pass Frequently Asked Questions?",
      buttons: [
        {
          text: 'Cancel',
          classes: 'btn btn-outline-secondary',
          onClick: function () {
            self.faqEditModalRef.hide();
          },
        },
        {
          text: 'Confirm',
          classes: 'btn btn-primary',
          onClick: function () {
            self.submitFaqChanges();
            self.faqEditModalRef.hide();
          },
        },
      ],
    };
    this.faqEditModalRef = this.modalService.show(
      this.faqEditTemplate,
      {
        class: 'modal-lg',
      }
    );
  }

  submitFaqChanges() {
    if (this.form.valid) {
      const formData = {
        faq: this.form.value.wysiwygFaq,
      };
      this.faqService.putFaq(formData);
    }
  }

  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
