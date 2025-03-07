import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsFormsModule } from '../shared/components/ds-forms/ds-forms.module';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaqRoutingModule } from './faq-routing.module';

import { FaqComponent } from './faq.component'
import { BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import { FaqEditComponent } from './faq-edit/faq-edit.component';


@NgModule({
    imports: [
    CommonModule,
    RouterModule,
    ModalModule,
    ReactiveFormsModule,
    DsFormsModule,
    FaqRoutingModule,
    FaqEditComponent,
    FaqComponent,
],
    providers: [BsModalService],
})
export class FaqModule {}
