import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModifierService } from 'app/services/modifier.service';
import { takeWhile } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { ReservationService } from 'app/services/reservation.service';

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

  private parkName = '';

  constructor(private modifierService: ModifierService, private reservationService: ReservationService) {}

  ngOnInit() {
    this.modifierService
      .getListValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        if (res) {
          this.modifierList = res;
        }
      });
    this.parkName = this.facility.pk.substring(this.facility.pk.indexOf('::') + 2);
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
        parkName: this.parkName,
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
        await this.modifierService.setModifier(putObj);
        this.modifierForm.reset();
        this.reset.emit();
        this.refreshModifiers();
        this.refreshReservationService();
      }
    }
  }

  async deleteModifier(modifier) {
    await this.modifierService.deleteModifier(this.parkName, this.facility.name, modifier.sk);
    this.refreshModifiers();
    this.refreshReservationService();
  }

  refreshModifiers() {
    this.modifierService.fetchData(
      this.parkName,
      this.facility.name,
      DateTime.now().setZone('America/Vancouver').toISODate()
    );
  }

  refreshReservationService() {
    this.reservationService.fetchData(
      this.parkName,
      this.facility.name,
      DateTime.now().setZone('America/Vancouver').toISODate()
    );
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
