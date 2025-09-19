import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassesCapacityBarComponent } from './passes-capacity-bar.component';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

describe('PassesCapacityBarComponent', () => {
  let component: PassesCapacityBarComponent;
  let fixture: ComponentFixture<PassesCapacityBarComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let capacitySubject: Subject<any>;

  beforeEach(async () => {
    capacitySubject = new Subject<any>();
    mockDataService = jasmine.createSpyObj('DataService', ['watchItem']);
    mockDataService.watchItem.and.returnValue(capacitySubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [PassesCapacityBarComponent],
      providers: [
        { provide: DataService, useValue: mockDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PassesCapacityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to CURRENT_CAPACITY_BAR_OBJECT and set data', () => {
    const testData = { foo: 'bar' };
    capacitySubject.next(testData);
    expect(component.data).toEqual(testData);
  });

  it('should have a subscriptions property as Subscription', () => {
    expect(component['subscriptions']).toBeDefined();
    expect(typeof component['subscriptions'].unsubscribe).toBe('function');
  });

  it('should not throw on ngOnInit', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should clean up subscriptions on destroy', () => {
    spyOn(component['subscriptions'], 'unsubscribe');
    if (component['subscriptions'].unsubscribe) {
      component['subscriptions'].unsubscribe();
    }
    expect(component['subscriptions'].unsubscribe).toHaveBeenCalled();
  });
});
