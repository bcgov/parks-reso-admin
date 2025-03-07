import { Component, Input, TemplateRef } from '@angular/core';
import { NgIf, NgFor, NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-pass-accordion',
    templateUrl: './pass-accordion.component.html',
    styleUrls: ['./pass-accordion.component.scss'],
    imports: [NgIf, NgFor, NgClass, NgTemplateOutlet]
})

export class PassAccordionComponent {
  @Input() rowSchema: any[] = [];
  @Input() dropDownSchema: any[] = [];
  @Input() cancelTemplate: TemplateRef<any>;
  @Input() pass: any;
  @Input() isHeader: boolean = false;

  getHeaderColumns() {
    let columns = [];
    let size = this.getCurrentScreenSize();
    if (this.rowSchema) {
      columns = this.rowSchema.filter(column => column?.dropdown <= size);
    }
    return columns;
  }

  getDropdownColumns() {
    let columns = [];
    let size = this.getCurrentScreenSize();
    if (this.rowSchema) {
      columns = this.rowSchema.filter(column => column?.dropdown > size);
    }
    return columns;
  }

  getCurrentScreenSize() {
    // TODO: breakpoints are hard-coded. Can we load these straight from our bootstrap theme?
    // Note: The breakpoints are slightly greater than the bootstrap set breakpoints to ensure no overflows
    const buffer = 40;
    const size = window.innerWidth;
    if (size < 400 + buffer) {
      return 0;
    } else if (size < 576 + buffer) {
      return 1;
    } else if (size <= 768 + buffer) {
      return 2;
    } else if (size <= 992 + buffer) {
      return 3;
    } else if (size <= 1200 + buffer) {
      return 4;
    } else if (size <= 1400 + buffer) {
      return 5;
    } else {
      return 6;
    }
  }
}
