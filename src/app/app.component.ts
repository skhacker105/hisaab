import { Component } from '@angular/core';
import { FilterService } from './services';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionDialogComponent } from './components';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  year!: number;
  month!: number;
  years: number[] = [];
  

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1; // assuming your month values are 1-indexed

  isHomeRoute: boolean = true;
  isChartRoute = false;

  constructor(
    public filterService: FilterService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isHomeRoute = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
        this.isChartRoute = event.urlAfterRedirects === '/charts';
      });
  }

  ngOnInit() {
    this.years = Array.from({ length: 5 }, (_, i) => this.currentYear - i);
    this.year = this.currentYear;
    this.month = new Date().getMonth() + 1;
    this.onFilterChange();
  }

  onFilterChange() {
    this.year = +this.year;
    this.month = +this.month;
    this.filterService.setYear(this.year);
    this.filterService.setMonth(this.month);
  }

  openAddTransactionDialog() {
    this.dialog.open(AddTransactionDialogComponent, {
      width: '400px'
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToTentative() {
    this.router.navigate(['/tentative']);
  }

  gotoCharts() {
    this.router.navigate(['/charts']);
  }

  gotoCategory() {
    this.router.navigate(['/categories']);
  }
}
