import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {
  @Input() control = new FormControl<boolean | null>(false);
  @Input() label;
  @Input() description = '';
  @Input() trueText = '';
  @Input() falseText = '';
  @Input() id;
  @Input() ariaLabel;
  @Input() ariaDescribedBy;

  public state;

  constructor() { }

  ngOnInit(): void {
  }

  getSwitchState(){
    if (this.control?.value){
      return true;
    }
    return false;
  }

}
