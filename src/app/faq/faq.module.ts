import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsFormsModule } from '../shared/components/ds-forms/ds-forms.module';
import { TableModule } from '../shared/components/table/table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaqRoutingModule } from './faq-routing.module';
import { TextWithIconsModule } from '../shared/components/text-with-icons/text-with-icons.module';
import { FaqComponent } from './faq.component'
import { BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import { FaqEditComponent } from './faq-edit/faq-edit.component';
import { DsModalModule } from '../shared/components/modal/ds-modal.module';

@NgModule({
  declarations: [
    FaqEditComponent,
    FaqComponent,
  ],
  imports: [
    CommonModule,
    TextWithIconsModule,
    TableModule,
    RouterModule,
    ModalModule,
    DsModalModule,
    ReactiveFormsModule,
    DsFormsModule,
    FaqRoutingModule,
    
  ],
  providers: [BsModalService],
})
export class FaqModule {}
