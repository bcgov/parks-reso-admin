import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartMetricComponent } from './chart-metric.component';

describe('ChartMetricComponent', () => {
  let component: ChartMetricComponent;
  let fixture: ComponentFixture<ChartMetricComponent>;

  let buildSpy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartMetricComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartMetricComponent);
    component = fixture.componentInstance;
    buildSpy = spyOn(component, 'buildChart').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handles observables', async () => {
    component.labels = ['label1', 'label2'];
    component.datasets = ['dataset1', 'dataset2'];
    component.options = { option1: 'option1' };
    component.plugins = ['plugin1'];
    component['_isChartReady'].next(true);
    await fixture.isStable();
    fixture.detectChanges();
  });

  it('awaits all async calls before building chart', async () => {
    expect(buildSpy).not.toHaveBeenCalled();
    component.title = 'chart title';
    component.type = 'bar';
    component['_labels'].next(['label1', 'label2']);
    component['_datasets'].next([
      { label: 'dataset1', data: 1 },
      { label: 'dataset2', data: 2 },
    ]);
    await fixture.isStable();
    fixture.detectChanges();
    expect(buildSpy).toHaveBeenCalledTimes(2);
  });

  it('destroys', async () => {
    const destroySpy = spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalledTimes(1);
  });
});
