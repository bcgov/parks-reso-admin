import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassManagementHomeComponent } from './pass-management-home.component';
import { ConfigService } from 'src/app/services/config.service';

describe('PassManagementHomeComponent', () => {
  let component: PassManagementHomeComponent;
  let fixture: ComponentFixture<PassManagementHomeComponent>;

  let mockConfigService = {
    config: {
      QR_CODE_ENABLED: true
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassManagementHomeComponent],
      providers: [
        { provide: ConfigService, useValue: mockConfigService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PassManagementHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.cardConfig.length).toBe(2);
  });
});
