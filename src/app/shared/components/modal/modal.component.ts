import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

export interface modalSchema {
  id: string;
  title: string;
  body: any;
  buttons?: modalButtonSchema[];
}

export interface modalButtonSchema {
  text: string;
  classes?: string;
  onClick: Function;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() modal: modalSchema;

  constructor(
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {}

  close(){
    this.modalService.hide()
  }

}
