import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-nav-card',
    templateUrl: './nav-card.component.html',
    styleUrls: ['./nav-card.component.scss'],
    standalone: true,
})
export class NavCardComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() cardHeader;
  @Input() cardTitle;
  @Input() cardText;
  @Input() navigation;
  @Input() relative: boolean = false;

  ngOnInit(): void { }

  navigate(nav) {
    if (this.relative) {
      this.router.navigate([nav], { relativeTo: this.route });
    } else {
      this.router.navigate([nav]);
    }
  }
}
