import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

@Component({
    selector: 'app-text-with-icons',
    templateUrl: './text-with-icons.component.html',
    styleUrls: ['./text-with-icons.component.scss'],
    imports: [NgFor, NgClass]
})
export class TextWithIconsComponent implements OnInit {
  @Input() text;
  @Input() icons = [] as any[];

  constructor() {}

  ngOnInit(): void {}
}
