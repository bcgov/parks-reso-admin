import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { LoggerService } from 'src/app/services/logger.service';
import { PassService } from 'src/app/services/pass.service';
import { QrScannerService } from 'src/app/shared/components/qr-scanner/qr-scanner.service';

import { PassCheckInListComponent } from './pass-check-in-list.component';

describe('PassLookupComponent', () => {
  let component: PassCheckInListComponent;
  let fixture: ComponentFixture<PassCheckInListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassCheckInListComponent],
      providers: [
        PassService,
        LoggerService,
        DataService,
        QrScannerService,
        ConfigService,
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PassCheckInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
