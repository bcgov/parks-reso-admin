import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParksModule } from 'app/parks/parks.module';
import { ConfigService } from 'app/services/config.service';
import { KeycloakService } from 'app/services/keycloak.service';
import { DialogService } from 'ng2-bootstrap-modal';

import { ParkFormComponent } from './park-form.component';

describe('ParkFormComponent', () => {
  let component: ParkFormComponent;
  let fixture: ComponentFixture<ParkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        ParksModule,
        HttpClientTestingModule
      ],
      providers: [
        ConfigService,
        KeycloakService,
        { provide: DialogService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
