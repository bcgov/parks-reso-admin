import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygInputComponent } from './wysiwyg-input.component';

describe('WysiwygInputComponent', () => {
  let component: WysiwygInputComponent;
  let fixture: ComponentFixture<WysiwygInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WysiwygInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WysiwygInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
