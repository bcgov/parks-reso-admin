import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';

import { ModifiersListComponent } from './modifiers-list.component';

describe('ModifiersListComponent', () => {
  let component: ModifiersListComponent;
  let fixture: ComponentFixture<ModifiersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifiersListComponent],
      providers: [HttpClient, HttpHandler, ConfigService],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifiersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
