import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfigService } from 'src/app/services/config.service';
import { MockTableUtils } from '../table.component.spec';

import { TableRowComponent } from './table-row.component';

describe('TableRowComponent', () => {
  let component: TableRowComponent;
  let fixture: ComponentFixture<TableRowComponent>;

  let mockTableUtils = new MockTableUtils();

  let mockColumnSchema = [
    mockTableUtils.mockColumnSchema1,
    mockTableUtils.mockColumnSchema2,
    mockTableUtils.mockColumnSchema3,
  ];

  let mockRowData = {
    col: { value: 'data1' },
    col2: { value: 'data2', display: 'displaydata2' },
    col3: {
      value: 'data3',
      cellTemplate: mockTableUtils.mockCellTemplate('value'),
    },
    raw: { rawData1: 'rawData1', rawData2: 'rawData2' },
    onClick: () => {
      return 'mockOnClick';
    },
  };

  let loadComponentsSpy = jasmine.createSpy();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableRowComponent],
      providers: [ConfigService, HttpClient, HttpHandler],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRowComponent);
    component = fixture.componentInstance;
    component.rowData = mockRowData;
    loadComponentsSpy = spyOn(component, 'loadComponents').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.rowData).toBeDefined();
    expect(loadComponentsSpy).toHaveBeenCalledTimes(1);
  });

  it('gathers any cell templates used in the row', async () => {
    const list = component.getComponentIdList();
    // rowData 'col3' is the only row with a template
    expect(list).toEqual(['col3']);
  });

  it('executes row click', async () => {
    const rowClickSpy = spyOn(component.rowData, 'onClick').and.callThrough();
    component.onClick();
    expect(rowClickSpy).toHaveBeenCalledTimes(1);
    expect(component.rowData.onClick()).toEqual('mockOnClick');
  });

  it('loads components', async () => {
    component.columnSchema = mockColumnSchema;
    await fixture.isStable();
    fixture.detectChanges();
    component.loadComponents();
    // there should only be 1 component in this mock setup
    expect(component.cellTemplateComponents.length).toEqual(1);
  });
});
