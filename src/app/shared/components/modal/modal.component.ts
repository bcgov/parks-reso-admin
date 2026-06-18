import { Component, Input, OnInit, inject } from '@angular/core';
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
    imports: []
})
export class ModalComponent implements OnInit {
  private modalService = inject(BsModalService);

  @Input() modal: modalSchema;

  ngOnInit(): void {}

  close(){
    this.modalService.hide()
  }

}
