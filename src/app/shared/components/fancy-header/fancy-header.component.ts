import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-fancy-header',
    templateUrl: './fancy-header.component.html',
    styleUrls: ['./fancy-header.component.scss'],
    imports: []
})
export class FancyHeaderComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() mainText = '';
  @Input() headerColour1 = '#5475a7';
  @Input() headerColour2 = '#003366';
  @Input() buttonSettings1 = { active: false, text: '', nav: '', hidden: true };
  @Input() buttonSettings2 = { active: false, text: '', nav: '', hidden: true };

  ngOnInit(): void {}

  navigate(nav) {
    if (nav) {
      this.router.navigate([nav], { relativeTo: this.route });
    }
  }
}
