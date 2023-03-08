import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-with-icons',
  templateUrl: './text-with-icons.component.html',
  styleUrls: ['./text-with-icons.component.scss'],
})
export class TextWithIconsComponent implements OnInit {
  @Input() text;
  @Input() icons = [] as any[];

  constructor() {}

  ngOnInit(): void {}
}
