import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';
import { MockData } from 'src/app/shared/utils/mock-data';

import { ParksListComponent } from './parks-list.component';
import { ConfigService } from 'src/app/services/config.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ParksListComponent', () => {
  let component: ParksListComponent;
  let fixture: ComponentFixture<ParksListComponent>;

  let mockPark1 = MockData.mockPark_1;
  let mockPark2 = MockData.mockPark_2;

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return new BehaviorSubject([mockPark1, mockPark2]);
      }
      return new BehaviorSubject(null);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ParksListComponent],
      providers: [
        ConfigService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.tableRows.length).toEqual(2);
  });

  it('creates the table', async () => {
    const navSpy = spyOn(component['router'], 'navigate');
    // on row click, navigate to park details
    const rowClick = component.tableSchema.rowClick(mockPark1);
    rowClick();
    expect(navSpy).toHaveBeenCalledOnceWith(['MOC1'], {
      relativeTo: component['route'],
    });
    navSpy.calls.reset();
    // table columns
    const columns = component.tableSchema.columns;
    expect(columns[0].mapValue(mockPark1)).toEqual('Mock Park 1');
    expect(columns[1].mapValue(mockPark1)).toEqual('open');
    expect(columns[1].mapDisplay(mockPark1)).toEqual('Passes Required');
    expect(columns[2].mapValue(mockPark1)).toEqual(null);
    // clickable park edit button
    const button = columns[2].cellTemplate(mockPark1);
    button.inputs.onClick();
    expect(navSpy).toHaveBeenCalledTimes(1);
  });
});
