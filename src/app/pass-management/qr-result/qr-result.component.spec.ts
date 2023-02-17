import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrResultComponent } from './qr-result.component';

describe('QrResultComponent', () => {
  let component: QrResultComponent;
  let fixture: ComponentFixture<QrResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
