import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ParksListComponent } from './parks-list.component';

describe('ParksListComponent', () => {
  let component: ParksListComponent;
  let fixture: ComponentFixture<ParksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParksListComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ParksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
