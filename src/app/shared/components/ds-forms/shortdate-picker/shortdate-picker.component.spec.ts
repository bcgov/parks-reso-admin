import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortdatePickerComponent } from './shortdate-picker.component';

describe('ShortdatePickerComponent', () => {
  let component: ShortdatePickerComponent;
  let fixture: ComponentFixture<ShortdatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortdatePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortdatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
