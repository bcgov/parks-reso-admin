import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BasicMetricComponent } from './basic-metric.component';

describe('BasicMetricComponent', () => {
  let component: BasicMetricComponent;
  let fixture: ComponentFixture<BasicMetricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicMetricComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BasicMetricComponent);
    component = fixture.componentInstance;
    component._value = 2000;
    component.label = 'Test Label';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the metric card properly', async () => {
    const cardElement = fixture.debugElement.query(By.css('.card-body')).nativeElement;
    const level = cardElement.getElementsByTagName('h4')[0];
    expect(level.innerText).toContain('Test Label');
    const value = cardElement.getElementsByTagName('h1')[0];
    expect(value.innerText).toContain('2,000');
    component._value = 2500;
    fixture.detectChanges();
    expect(value.innerText).toContain('2,500');
  });
});
