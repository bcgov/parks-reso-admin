import { formatNumber } from '@angular/common';
import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  animationFrameScheduler,
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  endWith,
  interval,
  map,
  Subject,
  switchMap,
  takeUntil,
  takeWhile,
} from 'rxjs';

@Directive({
  // eslint-disable-next-line
  selector: '[countTo]',
})
export class CountToDirective implements OnDestroy, OnInit {
  @Input('countTo') set count(count: number) {
    this._oldCount.next(this._count.value || 0);
    this._count.next(count);
  }
  @Input() set duration(duration: number) {
    this._duration.next(duration);
  }
  @Input() set jitter(jitter: boolean) {
    this._jitter.next(jitter);
  }

  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  // default count
  private readonly _count = new BehaviorSubject(0);
  private readonly _oldCount = new BehaviorSubject(0);
  // default duration
  private readonly _duration = new BehaviorSubject(1000);
  // default jitter (countUp takes up to 20% longer for randomized effect)
  private readonly _jitter = new BehaviorSubject(false);

  private readonly _currentValue = combineLatest([
    this._count,
    this._duration,
    this._oldCount,
  ]).pipe(
    switchMap(([count, animationDuration, oldCount]) => {
      // get distance between number change
      const distance = count - oldCount;
      // stagger finish time
      if (this._jitter.value) {
        animationDuration = Math.floor(
          animationDuration * (1 + Math.random() / 5)
        );
      }
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(animationDuration / frameDuration);
      return interval(frameDuration, animationFrameScheduler).pipe(
        map((currentFrame) => currentFrame / totalFrames),
        takeWhile((progress) => progress <= 1),
        map((progress) => this.easeOutQuart(progress)),
        map((progress) => oldCount + Math.round(progress * distance)),
        endWith(count),
        distinctUntilChanged()
      );
    })
  );

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.displayCurrentCount();
  }

  // Quartic ease out function
  easeOutQuart(x: number): number {
    return 1 - Math.pow(1 - x, 4);
  }
  
  private displayCurrentCount(): void {
    this._currentValue
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currentValue) => {
        let displayValue = formatNumber(currentValue, 'en-US');
        if (isNaN(currentValue)) {
          displayValue = '-';
        }
        this.renderer.setProperty(
          this.elementRef.nativeElement,
          'innerHTML',
          displayValue
        );
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.complete();
  }
}
