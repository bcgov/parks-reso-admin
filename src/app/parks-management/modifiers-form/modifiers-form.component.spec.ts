import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from 'src/app/services/config.service';

import { ModifiersFormComponent } from './modifiers-form.component';

describe('ModifiersFormComponent', () => {
  let component: ModifiersFormComponent;
  let fixture: ComponentFixture<ModifiersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifiersFormComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [HttpClient, HttpHandler, ConfigService],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifiersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
