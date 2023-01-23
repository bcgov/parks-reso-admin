import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../services/config.service';

import { PassManagementComponent } from './pass-management.component';

describe('PassManagementComponent', () => {
  let component: PassManagementComponent;
  let fixture: ComponentFixture<PassManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassManagementComponent],
      providers: [ConfigService],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PassManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
