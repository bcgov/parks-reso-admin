import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgIf, NgFor } from '@angular/common';

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
    imports: [NgIf, NgFor]
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
