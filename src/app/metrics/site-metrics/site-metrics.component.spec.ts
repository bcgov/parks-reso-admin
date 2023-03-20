import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';

import { SiteMetricsComponent } from './site-metrics.component';

describe('SiteMetricsComponent', () => {
  let component: SiteMetricsComponent;
  let fixture: ComponentFixture<SiteMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteMetricsComponent ],
      imports: [HttpClientModule],
      providers: [ConfigService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
