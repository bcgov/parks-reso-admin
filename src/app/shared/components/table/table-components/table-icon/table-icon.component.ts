import { ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
    selector: 'app-table-icon',
    templateUrl: './table-icon.component.html',
    styleUrls: ['./table-icon.component.scss'],
    standalone: true
})
export class TableIconComponent {
  @Input() altText: string;
  @Input() iconClass: string;

  constructor() {}

}
