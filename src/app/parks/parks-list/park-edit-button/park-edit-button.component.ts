import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-park-edit-button',
  templateUrl: './park-edit-button.component.html',
  styleUrls: ['./park-edit-button.component.scss']
})
export class ParkEditButtonComponent {
  @Input() data: any;

  constructor(
    private router: Router
  ) { }

  goToParkEdit(event) {
    // in case rowClick is active
    event.stopPropagation();
    this.router.navigate(['/park/'+ this.data.name + '/edit'])
  }

}
