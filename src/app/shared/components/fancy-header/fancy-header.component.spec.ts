import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FancyHeaderComponent } from './fancy-header.component';

describe('FancyHeaderComponent', () => {
  let component: FancyHeaderComponent;
  let fixture: ComponentFixture<FancyHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RouterTestingModule, FancyHeaderComponent],
}).compileComponents();

    fixture = TestBed.createComponent(FancyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates', async () => {
    const navSpy = spyOn(component['router'], 'navigate');
    component.navigate('mock');
    expect(navSpy).toHaveBeenCalledOnceWith(['mock'], {
      relativeTo: component['route'],
    });
  });
});
