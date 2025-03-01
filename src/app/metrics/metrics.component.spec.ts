import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricsComponent } from './metrics.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ConfigService } from '../services/config.service';

describe('MetricsComponent', () => {
  let component: MetricsComponent;
  let fixture: ComponentFixture<MetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MetricsComponent],
    providers: [HttpClient, HttpHandler, ConfigService]
})
    .compileComponents();

    fixture = TestBed.createComponent(MetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
