import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassSearchComponent } from './pass-search.component';
import { ConfigService } from 'src/app/services/config.service';
import { MockData } from 'src/app/shared/utils/mock-data';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { Constants } from 'src/app/shared/utils/constants';
import { DataService } from 'src/app/services/data.service';
import { KeycloakService } from 'src/app/services/keycloak.service';
import { BsModalService } from 'ngx-bootstrap/modal';

describe('PassSearchComponent', () => {
  let component: PassSearchComponent;
  let fixture: ComponentFixture<PassSearchComponent>;

  let mockFacility = MockData.mockFacility_1;

  let mockKeycloakService = {
    isAllowed: () => {
      return true;
    },
  };

  let mockConfigService = {
    config: {
      ADVANCE_BOOKING_HOUR: 8,
      ADVANCE_BOOKING_LIMIT: 0
    }
  }

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return new BehaviorSubject([]);
      }
      if (id === Constants.dataIds.PASS_SEARCH_PARAMS) {
        return new BehaviorSubject([]);
      }
      if (id === Constants.dataIds.FILTERED_PASSES_LIST) {
        return new BehaviorSubject([]);
      }
      if (id === Constants.dataIds.CURRENT_FACILITY_KEY) {
        return new BehaviorSubject(null);
      }
      if (id === Constants.dataIds.PASS_SEARCH_PARAMS) {
        return new BehaviorSubject(null);
      }
      if (id === Constants.dataIds.CURRENT_CAPACITY_BAR_OBJECT) {
        return new BehaviorSubject(null);
      }
      if (id === Constants.dataIds.PASSES_LIST) {
        return new BehaviorSubject([]);
      }
      if (id === Constants.dataIds.PASS_LAST_EVALUATED_KEY) {
        return new BehaviorSubject(null);
      }
      return null;
    },
    getItemValue: (id) => { }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassSearchComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DataService, useValue: mockDataService },
        { provide: KeycloakService, useValue: mockKeycloakService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: [],
              paramMap: {
                get: () => '',
              },
            },
          },
        },
        { provide: ConfigService, useValue: mockConfigService },
        BsModalService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PassSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
