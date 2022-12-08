import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from 'src/app/services/logger.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ConfigService } from 'src/app/services/config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { TextToLoadingSpinnerComponent } from './text-to-loading-spinner.component';

describe('TextToLoadingSpinnerComponent', () => {
  let component: TextToLoadingSpinnerComponent;
  let fixture: ComponentFixture<TextToLoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextToLoadingSpinnerComponent ],
      providers: [LoggerService, LoadingService, ConfigService, HttpClient, HttpHandler]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextToLoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
