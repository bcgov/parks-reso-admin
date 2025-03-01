import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  QueryList,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { columnSchema } from '../table.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
    // Throws the following linting error: https://angular.io/guide/styleguide#style-05-03
    // This component is given an [attribute] selector because it augments
    // the HTML element <tr>. We do this so that the child <tr> elements of a <table>
    // can be custom components while remaining aligned with the parent <table> component.
    // eslint-disable-next-line
    selector: '[app-table-row]',
    templateUrl: './table-row.component.html',
    styleUrls: ['./table-row.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf],
})
export class TableRowComponent implements AfterViewInit, OnDestroy {
  @Input() columnSchema: columnSchema[];
  @Input() set rowData(value: any) {
    this._rowData.next(value);
  }

  private _rowData = new BehaviorSubject<any>([]);

  get rowData() {
    return this._rowData.getValue();
  }

  @ViewChildren('cellTemplateComponent', { read: ViewContainerRef })
  cellTemplateComponents: QueryList<ViewContainerRef>;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // Ensure rowData is loaded before rendering row.
    this._rowData.subscribe(() => {
      this.loadComponents();
    });
  }

  getComponentIdList() {
    // gather list of components in the row
    const keys = Object.keys(this.rowData);
    return keys.filter((e) => this.rowData[e].cellTemplate !== undefined);
  }

  onClick() {
    if (this.rowData.onClick) {
      this.rowData.onClick();
    }
  }

  // Load components and map them to their respective cells in the row
  loadComponents() {
    if (this.cellTemplateComponents) {
      this.cellTemplateComponents.map(
        (vcr: ViewContainerRef, index: number) => {
          vcr.clear();
          const componentIdList = this.getComponentIdList();
          const id = componentIdList.filter(
            (id) => componentIdList.indexOf(id) === index
          )[0];
          const template = this.rowData[id].cellTemplate;
          const cellTemplateComponent = vcr.createComponent<
            typeof template.component
          >(template.component);
          if (template.inputs) {
            for (const input of Object.keys(template.inputs)) {
              cellTemplateComponent.instance[input] = template.inputs[input];
            }
          }
        }
      );
    }
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this._rowData.unsubscribe();
  }
}
