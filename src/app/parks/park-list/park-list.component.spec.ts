import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ParksModule } from 'app/parks/parks.module';
import { SharedModule } from 'app/shared/shared.module';

import { ParkListComponent } from './park-list.component';
import { ConfigService } from 'app/services/config.service';

describe('ParkListComponent', () => {
  let component: ParkListComponent;
  let fixture: ComponentFixture<ParkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [SharedModule, ParksModule, HttpClientTestingModule],
      providers: [ConfigService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
