import { Component } from '@angular/core';
import { FilterService } from './services';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionDialogComponent } from './components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  year!: number;
  month!: number;
  years: number[] = [];
  months = [
    { name: 'Jan', value: 1 }, { name: 'Feb', value: 2 }, { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 }, { name: 'May', value: 5 }, { name: 'Jun', value: 6 },
    { name: 'Jul', value: 7 }, { name: 'Aug', value: 8 }, { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 }, { name: 'Nov', value: 11 }, { name: 'Dec', value: 12 }
  ];

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1; // assuming your month values are 1-indexed

  constructor(private filterService: FilterService, private dialog: MatDialog) { }

  ngOnInit() {
    this.years = Array.from({ length: 5 }, (_, i) => this.currentYear - i);
    this.year = this.currentYear;
    this.month = new Date().getMonth() + 1;
    this.onFilterChange();
  }

  onFilterChange() {
    this.filterService.setYear(this.year);
    this.filterService.setMonth(this.month);
  }

  openAddTransactionDialog() {
    this.dialog.open(AddTransactionDialogComponent, {
      width: '400px'
    });
  }
}
