import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class TableEditButtonComponent {
  @Input() route: any;

  constructor(
    private router: Router
  ) { }

  goToParkEdit(event) {
    // in case rowClick is active
    console.log('this.checkVar:', this.route);
    event.stopPropagation();
    this.router.navigate([this.route])
  }

}
