import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';
import { MockData } from 'src/app/shared/utils/mock-data';

import { ModifiersListComponent } from './modifiers-list.component';

describe('ModifiersListComponent', () => {
  let component: ModifiersListComponent;
  let fixture: ComponentFixture<ModifiersListComponent>;

  let mockReservationObj1 = MockData.mockReservationObj_1;
  let mockReservationObj2 = MockData.mockReservationObj_2;

  let mockReservationObjList = [mockReservationObj1, mockReservationObj2];

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.MODIFIERS) {
        return new BehaviorSubject(mockReservationObjList);
      }
      return new BehaviorSubject(null);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ModifiersListComponent],
    providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: DataService, useValue: mockDataService },
    ],
}).compileComponents();

    fixture = TestBed.createComponent(ModifiersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    expect(component.tableRows.length).toEqual(2);
    expect(component.tableSchema).toBeDefined();
    const columns = component.tableSchema.columns;
    expect(columns[0].mapValue(mockReservationObj1)).toEqual('2022-12-21');
    expect(columns[1].mapValue(mockReservationObj1)).toEqual(8);
    expect(columns[2].mapValue(mockReservationObj1)).toEqual(-1);
    expect(columns[3].mapValue(mockReservationObj1)).toEqual('n/a');
    expect(columns[4].mapValue(mockReservationObj1)).toBeNull();
    // check inline delete button
    const deleteSpy = spyOn(component, 'deleteModifierObj');
    const deleteButton = columns[4].cellTemplate();
    await deleteButton.inputs.onClick();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('calls for delete modifier', async () => {
    const deleteServiceSpy = spyOn(
      component['modifierService'],
      'deleteModifier'
    );
    await component.deleteModifierObj(mockReservationObj1);
    expect(deleteServiceSpy).toHaveBeenCalledOnceWith(
      'MOC1',
      'Mock Facility 1',
      '2022-12-21'
    );
  });

  it('shows empty table message', async () => {
    component.tableRows = [];
    fixture.detectChanges();
    const tableElement =
      fixture.debugElement.nativeElement.querySelector('div');
    const messageElement = tableElement.querySelector('div');
    expect(messageElement.innerText).toEqual('There are no scheduled capacity changes.')
  });
});
