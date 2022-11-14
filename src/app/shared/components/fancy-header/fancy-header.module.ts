import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FancyHeaderComponent } from './fancy-header.component';

@NgModule({
  declarations: [FancyHeaderComponent],
  imports: [CommonModule],
  exports: [FancyHeaderComponent],
})
export class FancyHeaderModule {}
