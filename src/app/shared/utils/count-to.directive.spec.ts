import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CountToDirective } from './count-to.directive';

describe('CountToDirective', () => {
  let directive: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        CountToDirective,
        { provide: ElementRef, useValue: new ElementRef('p') },
        { provide: Renderer2, useValue: null },
      ],
    });
    directive = TestBed.inject(CountToDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('calulates quartic ease function properly', async () => {
    let res = directive.easeOutQuart(3);
    expect(res).toEqual(-15);
  });

  it('calls display functions', () => {
    const displaySpy = spyOn(directive, 'displayCurrentCount');
    directive.count = 2500;
    expect(directive._count.value).toBe(2500);
    directive.count = 3000;
    expect(directive._count.value).toBe(3000);
    expect(directive._oldCount.value).toBe(2500);
    directive.jitter = true;
    expect(directive._jitter.value).toBeTrue();
    directive.duration = 1500;
    expect(directive._duration.value).toBe(1500);
    directive.ngOnInit();
    expect(displaySpy).toHaveBeenCalledTimes(1);
  });

  it('destroys', () => {
    const unsubscribeSpy = spyOn(directive.ngUnsubscribe, 'complete');
    directive.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  });
});
