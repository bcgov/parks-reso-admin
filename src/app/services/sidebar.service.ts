import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter();

  isOpen = false;

  constructor() { }

  toggle() {
    this.isOpen = !this.isOpen;
    this.toggleChange.emit(this.isOpen);
  }

  close() {
    this.isOpen = false;
    this.toggleChange.emit(this.isOpen);
  }
}
