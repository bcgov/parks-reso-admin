import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  modalButtonSchema,
  ModalComponent,
  modalSchema,
} from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  let mockModalButton: modalButtonSchema = {
    text: 'text',
    onClick: () => {},
  };

  let mockModal: modalSchema = {
    id: 'modal',
    title: 'Title',
    body: '<p>Modal body</p>',
    buttons: [mockModalButton],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ModalComponent],
    providers: [BsModalService],
}).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides the modal', async () => {
    const modalSpy = spyOn(component['modalService'], 'hide');
    component.close();
    expect(modalSpy).toHaveBeenCalledTimes(1);
  });

  it('renders the modal', async () => {
    component.modal = mockModal;
    await fixture.isStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title'));
    expect(title.nativeElement.innerHTML).toEqual('Title');
    const body = fixture.debugElement.query(By.css('.modal-body'));
    expect(body.nativeElement.innerText).toContain('Modal body');
    // buttons
    const buttonSpy = spyOn(component.modal.buttons[0], 'onClick');
    const buttons =
      fixture.debugElement.nativeElement.querySelectorAll('button');
    buttons[1].click();
    expect(buttonSpy).toHaveBeenCalledTimes(1);
  });
});
