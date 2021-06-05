import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PassComponent } from './pass.component';
import { PassModule } from './pass.module';

describe('PassComponent', () => {
  let component: PassComponent;
  let fixture: ComponentFixture<PassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        PassModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
