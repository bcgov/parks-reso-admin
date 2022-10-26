import { ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-button',
  templateUrl: './table-button.component.html',
  styleUrls: ['./table-button.component.scss'],
})
export class TableButtonComponent {
  @Input() onClick: Function = () => {};
  @Input() buttonClass: string;
  @Input() iconClass: string;
  @Input() isDisabled: boolean;

  constructor() {}

  onButtonClick(event) {
    event.stopPropagation();
    this.onClick();
  }
}
