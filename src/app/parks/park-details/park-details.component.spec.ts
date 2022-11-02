import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from 'src/app/services/config.service';

import { ParkDetailsComponent } from './park-details.component';

describe('ParkDetailsComponent', () => {
  let component: ParkDetailsComponent;
  let fixture: ComponentFixture<ParkDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkDetailsComponent],
      imports: [RouterTestingModule],
      providers: [HttpClient, HttpHandler, ConfigService],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
