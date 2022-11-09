import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ModifierService } from 'src/app/services/modifier.service';
import { TableButtonComponent } from 'src/app/shared/components/table/table-components/table-button/table-button.component';
import { tableSchema } from 'src/app/shared/components/table/table.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-modifiers-list',
  templateUrl: './modifiers-list.component.html',
  styleUrls: ['./modifiers-list.component.scss'],
})
export class ModifiersListComponent implements OnInit {
  public facility;
  public park;
  private subscriptions = new Subscription();
  public tableSchema: tableSchema;
  public tableRows: any[] = [];

  constructor(
    protected dataService: DataService,
    protected modifierService: ModifierService
  ) {
    this.subscriptions.add(
      dataService.watchItem(Constants.dataIds.MODIFIERS).subscribe((res) => {
        this.tableRows = res;
      })
    );
  }

  ngOnInit(): void {
    this.createTable();
  }

  async deleteModifierObj(modifierObj) {
    return await this.modifierService.deleteModifier(
      modifierObj.pk.split('::')[1],
      modifierObj.pk.split('::')[2],
      modifierObj.sk
    );
  }

  createTable() {
    this.tableSchema = {
      id: 'modifiers-list',
      columns: [
        {
          id: 'date',
          displayHeader: 'Date',
          columnClasses: 'ps-3 pe-3 font-weight-bold',
          mapValue: (modifierObj) => modifierObj.sk,
        },
        {
          id: 'am-change',
          displayHeader: 'AM Change',
          columnClasses: 'ps-3 pe-3',
          mapValue: (modifierObj) =>
            modifierObj.capacities?.AM?.capacityModifier || 'n/a',
        },
        {
          id: 'pm-change',
          displayHeader: 'PM Change',
          columnClasses: 'ps-3 pe-3',
          mapValue: (modifierObj) =>
            modifierObj.capacities?.PM?.capacityModifier || 'n/a',
        },
        {
          id: 'day-change',
          displayHeader: 'All-Day Change',
          columnClasses: 'ps-3 pe-3',
          mapValue: (modifierObj) =>
            modifierObj.capacities?.DAY?.capacityModifier || 'n/a',
        },
        {
          id: 'delete-modifier',
          displayHeader: '',
          columnClasses: 'ps-5 pe-3',
          width: '10%',
          mapValue: () => null,
          cellTemplate: (modifierObj) => {
            const self = this;
            return {
              component: TableButtonComponent,
              inputs: {
                altText: 'Delete',
                buttonClass: 'btn btn-outline-danger',
                iconClass: 'bi bi-trash3-fill',
                onClick: async function () {
                  await self.deleteModifierObj(modifierObj);
                },
              },
            };
          },
        },
      ],
    };
  }
}
