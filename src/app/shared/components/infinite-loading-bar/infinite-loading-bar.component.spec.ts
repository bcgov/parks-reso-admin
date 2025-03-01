import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from 'src/app/services/logger.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ConfigService } from 'src/app/services/config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { InfiniteLoadingBarComponent } from './infinite-loading-bar.component';

describe('InfiniteLoadingBarComponent', () => {
  let component: InfiniteLoadingBarComponent;
  let fixture: ComponentFixture<InfiniteLoadingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfiniteLoadingBarComponent],
    providers: [LoggerService, LoadingService, ConfigService, HttpClient, HttpHandler]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfiniteLoadingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
