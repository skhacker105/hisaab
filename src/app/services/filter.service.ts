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
  months = [
    { name: 'Jan', value: 1 }, { name: 'Feb', value: 2 }, { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 }, { name: 'May', value: 5 }, { name: 'Jun', value: 6 },
    { name: 'Jul', value: 7 }, { name: 'Aug', value: 8 }, { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 }, { name: 'Nov', value: 11 }, { name: 'Dec', value: 12 }
  ];

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
