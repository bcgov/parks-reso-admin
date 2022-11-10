import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';

import { ParkEditFormComponent } from './park-edit-form.component';

describe('ParkEditFormComponent', () => {
  let component: ParkEditFormComponent;
  let fixture: ComponentFixture<ParkEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkEditFormComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [HttpClient, HttpHandler, ConfigService],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
