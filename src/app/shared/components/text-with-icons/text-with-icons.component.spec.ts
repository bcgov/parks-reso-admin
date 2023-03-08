import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextWithIconsComponent } from './text-with-icons.component';

describe('TextWithIconsComponent', () => {
  let component: TextWithIconsComponent;
  let fixture: ComponentFixture<TextWithIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextWithIconsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextWithIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
