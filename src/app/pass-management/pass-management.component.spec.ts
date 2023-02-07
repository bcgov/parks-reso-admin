import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from '../services/config.service';
import { LoggerService } from '../services/logger.service';
import { PassService } from '../services/pass.service';
import { QrScannerService } from '../shared/components/qr-scanner/qr-scanner.service';

import { PassManagementComponent } from './pass-management.component';

describe('PassManagementComponent', () => {
  let component: PassManagementComponent;
  let fixture: ComponentFixture<PassManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassManagementComponent],
      providers: [PassService, LoggerService, QrScannerService, ConfigService],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PassManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
