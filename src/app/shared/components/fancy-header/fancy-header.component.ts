import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-fancy-header',
    templateUrl: './fancy-header.component.html',
    styleUrls: ['./fancy-header.component.scss'],
    imports: [NgIf]
})
export class FancyHeaderComponent implements OnInit {
  @Input() mainText = '';
  @Input() headerColour1 = '#5475a7';
  @Input() headerColour2 = '#003366';
  @Input() buttonSettings1 = { active: false, text: '', nav: '', hidden: true };
  @Input() buttonSettings2 = { active: false, text: '', nav: '', hidden: true };

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  navigate(nav) {
    if (nav) {
      this.router.navigate([nav], { relativeTo: this.route });
    }
  }
}
