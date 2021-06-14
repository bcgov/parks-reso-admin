import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PassesModule } from 'app/passes/passes.module';
import { ConfigService } from 'app/services/config.service';
import { KeycloakService } from 'app/services/keycloak.service';
import { DialogService } from 'ng2-bootstrap-modal';

import { PassTableRowComponent } from './pass-table-row.component';

describe('PassTableRowComponent', () => {
  let component: PassTableRowComponent;
  let fixture: ComponentFixture<PassTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        PassesModule,
        HttpClientTestingModule,
      ],
      providers: [
        DialogService,
        ConfigService,
        KeycloakService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
