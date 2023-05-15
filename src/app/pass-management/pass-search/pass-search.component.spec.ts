import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassSearchComponent } from './pass-search.component';
import { ConfigService } from 'src/app/services/config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MockData } from 'src/app/shared/utils/mock-data';

describe('PassSearchComponent', () => {
  let component: PassSearchComponent;
  let fixture: ComponentFixture<PassSearchComponent>;

  let mockFacility = MockData.mockFacility_1;

  let mockConfigService = {
    config: {
      ADVANCE_BOOKING_HOUR: 8,
      ADVANCE_BOOKING_LIMIT: 0
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassSearchComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: ConfigService, useValue: mockConfigService }
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
