import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

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
