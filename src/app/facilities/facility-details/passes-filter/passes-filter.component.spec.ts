import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';

import { PassesFilterComponent } from './passes-filter.component';

describe('PassesFilterComponent', () => {
  let component: PassesFilterComponent;
  let fixture: ComponentFixture<PassesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassesFilterComponent ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [HttpClient, HttpHandler, ConfigService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
