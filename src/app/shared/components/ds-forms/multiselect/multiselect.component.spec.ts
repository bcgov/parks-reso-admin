import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectComponent } from './multiselect.component';

describe('MultiselectComponent', () => {
  let component: MultiselectComponent;
  let fixture: ComponentFixture<MultiselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiselectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiselectComponent);
    component = fixture.componentInstance;
    component.multiSelectOptions = ['option 1', 'option 2', 'option 3'];
    fixture.detectChanges();
  });

  it('should initialize correctly', async () => {
    expect(component).toBeTruthy();
    // default
    component.selectedOptions = ['option 3', 'option 2'];
    component.control.setValue(null);
    component.ngOnInit();
    await fixture.isStable();
    expect(component.control.value).toEqual(component.selectedOptions);
    // input
    component.control.setValue(['option 1', 'option 3']);
    component.ngOnInit();
    await fixture.isStable();
    expect(component.control.value).toEqual(['option 1', 'option 3']);
  });

  it('should check if control is disabled', async () => {
    component.ngOnInit();
    await fixture.isStable();
    component.control.disable();
    expect(component.checkDisabled()).toBeTrue();
    component.control.enable();
    expect(component.checkDisabled()).toBeFalse();
  });

  it('should update multiselect', async () => {
    component.ngOnInit();
    await fixture.isStable();
    expect(component.control.value).toEqual([]);
    component.selectedOptions = ['option 3', 'option 2'];
    component.updateMultiselect();
    expect(component.control.value).toEqual(['option 3', 'option 2']);
  });

  it('should reflect changes', async () => {
    component.ngOnInit();
    await fixture.isStable();
  })
});
