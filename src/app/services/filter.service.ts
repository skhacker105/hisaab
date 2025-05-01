import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private yearSubject = new BehaviorSubject<number>(new Date().getFullYear());
  private monthSubject = new BehaviorSubject<number>(new Date().getMonth() + 1);

  year$ = this.yearSubject.asObservable();
  month$ = this.monthSubject.asObservable();

  setYear(year: number) {
    this.yearSubject.next(year);
  }

  setMonth(month: number) {
    this.monthSubject.next(month);
  }

  getCurrentYear() {
    return this.yearSubject.value;
  }

  getCurrentMonth() {
    return this.monthSubject.value;
  }
}
