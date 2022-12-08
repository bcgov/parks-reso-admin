import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from 'src/app/services/logger.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ConfigService } from 'src/app/services/config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      providers: [LoggerService, LoadingService, ConfigService, HttpClient, HttpHandler]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
