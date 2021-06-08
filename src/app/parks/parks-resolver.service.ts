import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ParkService } from 'app/services/park.service';

@Injectable()
export class ParksResolverService implements Resolve<void> {
  constructor(
    private parkService: ParkService
  ) { }

  resolve() {
    this.parkService.fetchData();
  }
}
