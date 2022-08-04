import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogService } from 'ng2-bootstrap-modal';

import { FacilitiesModule } from 'app/facilities/facilities.module';
import { ModifierListComponent } from './modifier-list.component';

describe('ModifierListComponent', () => {
  let component: ModifierListComponent;
  let fixture: ComponentFixture<ModifierListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FacilitiesModule],
      declarations: [],
      providers: [DialogService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
