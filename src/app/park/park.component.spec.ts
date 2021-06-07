import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ParksModule } from 'app/parks/parks.module';
import { ConfigService } from 'app/services/config.service';

import { ParkComponent } from './park.component';
import { ParkModule } from './park.module';

describe('ParkComponent', () => {
  let component: ParkComponent;
  let fixture: ComponentFixture<ParkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [ParkModule, ParksModule],
      providers: [ConfigService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
