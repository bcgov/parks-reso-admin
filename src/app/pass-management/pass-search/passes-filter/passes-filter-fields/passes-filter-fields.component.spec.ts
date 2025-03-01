import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';

import { PassesFilterFieldsComponent } from './passes-filter-fields.component';

describe('PassesFilterFieldsComponent', () => {
  let component: PassesFilterFieldsComponent;
  let fixture: ComponentFixture<PassesFilterFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PassesFilterFieldsComponent],
    providers: [HttpClient, HttpHandler, ConfigService],
})
    .compileComponents();

    fixture = TestBed.createComponent(PassesFilterFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
