import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkEditComponent } from './park-edit.component';
import { ConfigService } from 'src/app/services/config.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

describe('ParkEditComponent', () => {
  let component: ParkEditComponent;
  let fixture: ComponentFixture<ParkEditComponent>;
  let mockConfigService = {};
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkEditComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        BsModalService,
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '',
              },
            },
          },
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ParkEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
