import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassesCapacityBarComponent } from './passes-capacity-bar.component';

describe('PassesCapacityBarComponent', () => {
  let component: PassesCapacityBarComponent;
  let fixture: ComponentFixture<PassesCapacityBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PassesCapacityBarComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PassesCapacityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
