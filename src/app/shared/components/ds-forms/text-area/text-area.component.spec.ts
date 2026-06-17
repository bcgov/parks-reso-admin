import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaComponent } from './text-area.component';

describe('TextAreaComponent', () => {
  let component: TextAreaComponent;
  let fixture: ComponentFixture<TextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TextAreaComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get text field length', async () => {
    fixture.componentRef.setInput('charCap', 4);
    component.control.setValue(null);
    fixture.detectChanges();
    expect(component.getFieldLength()).toEqual(0);
    component.control.setValue('test');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(component.getFieldLength()).toEqual(4);
  });

  it('should stopPropagation when over character cap', async () => {
    const e = new KeyboardEvent('change');
    const overflow = spyOn(e, 'stopPropagation');
    // emit change from DOM element
    const inputElement =
      fixture.debugElement.nativeElement.getElementsByTagName('textarea')[0];
    component.control.setValue('test');
    // no overflow
    fixture.componentRef.setInput('charCap', 5);
    fixture.detectChanges();
    inputElement.dispatchEvent(e);
    expect(overflow).toHaveBeenCalledTimes(0);
    // overflow
    fixture.componentRef.setInput('charCap', 4);
    fixture.detectChanges();
    inputElement.dispatchEvent(e);
    expect(overflow).toHaveBeenCalled();
  });
});
