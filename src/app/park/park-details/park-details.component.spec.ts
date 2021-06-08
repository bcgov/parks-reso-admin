import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilitiesModule } from 'app/facilities/facilities.module';
import { ConfigService } from 'app/services/config.service';

import { ParkDetailsComponent } from './park-details.component';

describe('ParkDetailsComponent', () => {
  let component: ParkDetailsComponent;
  let fixture: ComponentFixture<ParkDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ParkDetailsComponent
      ],
      imports: [
        FacilitiesModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        ConfigService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
