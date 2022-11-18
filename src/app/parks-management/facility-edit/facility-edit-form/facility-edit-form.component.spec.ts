import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/services/config.service';

import { FacilityEditFormComponent } from './facility-edit-form.component';

describe('FacilityEditFormComponent', () => {
  let component: FacilityEditFormComponent;
  let fixture: ComponentFixture<FacilityEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacilityEditFormComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
      providers: [HttpClient, HttpHandler, ConfigService, BsModalService],
    }).compileComponents();

    fixture = TestBed.createComponent(FacilityEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
