import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-base-input',
  templateUrl: './base-input.component.html',
  styleUrls: ['./base-input.component.scss'],
})
export class BaseInputComponent implements OnDestroy {
  @Input() control = new UntypedFormControl();
  @Input() label;
  @Input() subLabel;
  @Input() icon;
  @Input() placeholder;
  @Input() id;
  @Input() ariaLabel;
  @Input() ariaDescribedBy;

  @Output() inputChange = new EventEmitter<any>();

  public subscriptions = new Subscription();

  public controlInitialized = new BehaviorSubject(false);

  constructor(
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.control.valueChanges.subscribe((res) => {
        this.inputChange.emit(res);
      })
    );
    this.controlInitialized.next(true);
  }

  isRequired() {
    if (this.control.hasValidator(Validators.required)) {
      return true;
    }
    return false;
  }

  isInvalid() {
    if (this.control?.invalid && this.control?.touched) {
      return true;
    }
    return false;
  }

  onChange(event) {
    this.inputChange.emit(event);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
