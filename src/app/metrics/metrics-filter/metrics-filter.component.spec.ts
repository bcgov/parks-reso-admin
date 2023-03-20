import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';

import { MetricsFilterComponent } from './metrics-filter.component';

describe('MetricsFilterComponent', () => {
  let component: MetricsFilterComponent;
  let fixture: ComponentFixture<MetricsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricsFilterComponent ],
      imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
      providers: [ConfigService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
