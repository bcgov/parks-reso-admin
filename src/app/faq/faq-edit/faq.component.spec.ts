import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed, tick, fakeAsync} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/services/config.service';
import { FaqEditComponent } from './faq-edit.component';

describe('FaqEditComponent', () => {
  let component: FaqEditComponent;
  let fixture: ComponentFixture<FaqEditComponent>;
  let mockConfigService = {};
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqEditComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: ConfigService, useValue: mockConfigService },
        BsModalService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FaqEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the form and buttons', () => {
    const formElement = fixture.nativeElement.querySelector('form');
    expect(formElement).toBeTruthy();

    const submitButton = fixture.nativeElement.querySelector('.btn-primary');
    expect(submitButton).toBeTruthy();

    const resetButton = fixture.nativeElement.querySelector('.btn-secondary');
    expect(resetButton).toBeTruthy();

    const cancelButton = fixture.nativeElement.querySelector('.btn-outline-danger');
    expect(cancelButton).toBeTruthy();
  });

  it('Do not load WYSIWYG', () => {
    component.fields = {};
    fixture.detectChanges();
    const wysiwygInput = fixture.nativeElement.querySelector('app-wysiwyg-input');
    expect(wysiwygInput).toBeFalsy();
  });

});
