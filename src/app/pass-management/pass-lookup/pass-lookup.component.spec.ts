import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { LoggerService } from 'src/app/services/logger.service';
import { PassService } from 'src/app/services/pass.service';
import { QrScannerService } from 'src/app/shared/components/qr-scanner/qr-scanner.service';

import { PassLookupComponent } from './pass-lookup.component';

describe('PassLookupComponent', () => {
  let component: PassLookupComponent;
  let fixture: ComponentFixture<PassLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassLookupComponent],
      providers: [
        PassService,
        LoggerService,
        DataService,
        QrScannerService,
        ConfigService,
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PassLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
