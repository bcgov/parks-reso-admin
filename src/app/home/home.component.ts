import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }


  navigate(nav) {
    this.router.navigate([nav], { relativeTo: this.route });
  }
}
