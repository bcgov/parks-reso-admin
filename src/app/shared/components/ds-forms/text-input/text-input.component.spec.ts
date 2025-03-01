import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from './text-input.component';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TextInputComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should block invalid characters', async () => {
    const e1 = new KeyboardEvent('keydown', { key: 'a' });
    const e2 = new KeyboardEvent('keydown', { key: 'e' });
    const allowSpy = spyOn(e1, 'preventDefault');
    const preventSpy = spyOn(e2, 'preventDefault');
    component.blockInvalidChars(e1);
    await fixture.detectChanges();
    expect(allowSpy).toHaveBeenCalledTimes(0);
    component.blockInvalidChars(e2);
    await fixture.detectChanges();
    expect(preventSpy).toHaveBeenCalled();
  });
});
