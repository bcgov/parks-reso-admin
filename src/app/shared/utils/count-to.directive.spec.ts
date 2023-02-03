import { ElementRef, Renderer2 } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { CountToDirective } from './count-to.directive';

describe('CountToDirective', () => {
  let directive;
  const elementRef = new ElementRef('p');
  let renderer: Renderer2;

  beforeEach(async () => {
    directive = new CountToDirective(elementRef, renderer);
  });

  it('should create an instance', () => {
    const elementRef = new ElementRef('p');
    let renderer: Renderer2;
    const directive = new CountToDirective(elementRef, renderer);
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
