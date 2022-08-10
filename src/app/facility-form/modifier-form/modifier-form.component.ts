import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModifierService } from 'app/services/modifier.service';
import { takeWhile } from 'rxjs/operators';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-modifier-form',
  templateUrl: './modifier-form.component.html',
  styleUrls: ['./modifier-form.component.scss']
})
export class ModifierFormComponent implements OnInit, OnDestroy {
  @Input() facility = {
    bookingTimes: null,
    pk: '',
    sk: '',
    name: ''
  };
  public reset: EventEmitter<any> = new EventEmitter<any>();
  public today = new Date();
  public timeslots = ['AM', 'PM', 'DAY'];
  public modifierList = [];
  private alive = true;

  public modifierForm = new FormGroup({
    date: new FormControl(),
    AM: new FormControl(),
    PM: new FormControl(),
    DAY: new FormControl()
  });

  constructor(private modifierService: ModifierService) {}

  ngOnInit() {
    this.modifierService
      .getListValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        if (res) {
          this.modifierList = res;
        }
      });

    this.setTimeslotForms();
  }

  private setTimeslotForms() {
    this.timeslots.forEach(timeslot => {
      if (!this.facility.bookingTimes[timeslot]) {
        this.modifierForm.controls[timeslot].disable();
      }
    });
  }

  public async submit() {
    if (this.modifierForm.controls['date'].value) {
      let shouldSubmit = false;

      // TODO: Account for timezones
      const shortDate = DateTime.fromObject({
        year: this.modifierForm.controls['date'].value.year,
        month: this.modifierForm.controls['date'].value.month,
        day: this.modifierForm.controls['date'].value.day
      }).toISODate();

      let putObj = {
        date: shortDate,
        bookingTimes: {},
        parkName: this.facility.pk.substring(this.facility.pk.indexOf('::') + 2),
        facility: this.facility.name
      };
      // Construct BTs
      this.timeslots.forEach(timeslot => {
        if (!this.modifierForm.controls[timeslot].disabled) {
          // If we are setting at least one thing, we fire off to the API
          if (this.modifierForm.controls[timeslot].value) {
            shouldSubmit = true;
          }
          putObj.bookingTimes[timeslot] = this.modifierForm.controls[timeslot].value
            ? this.modifierForm.controls[timeslot].value
            : 0;
        }
      });
      if (shouldSubmit) {
        const res = await this.modifierService.setModifier(putObj);
        this.modifierForm.reset();
        this.reset.emit();
        console.log(res);
        this.refreshModifiers();
      }
    }
  }

  async deleteModifier(modifier) {
    const res = await this.modifierService.deleteModifier(
      this.facility.pk.substring(this.facility.pk.indexOf('::') + 2),
      this.facility.name,
      modifier.sk
    );
    console.log(res);
    this.refreshModifiers();
  }

  refreshModifiers() {
    this.modifierService.fetchData(
      this.facility.pk.substring(this.facility.pk.indexOf('::') + 2),
      this.facility.name,
      DateTime.now().setZone('America/Vancouver').toISODate()
    );
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
