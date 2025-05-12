import { Component } from '@angular/core';
import { FilterService, LoggerService } from './services';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionDialogComponent } from './components';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  showWelcome = true;

  year!: number;
  month!: number;
  years: number[] = [];


  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1; // assuming your month values are 1-indexed

  isHomeRoute: boolean = true;
  isChartRoute = false;
  isWebProdVersion = true;
  isTentativeRoute = false;
  isCategoryRoute = false;

  constructor(
    public filterService: FilterService,
    private dialog: MatDialog,
    private router: Router,
    private loggerService: LoggerService
  ) {
    // if (environment.production)
      this.isWebProdVersion = Capacitor.getPlatform() === 'web' && environment.production
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        this.isHomeRoute = url === '/' || url === '/home';
        this.isChartRoute = url === '/charts';
        this.isTentativeRoute = url === '/tentative';
        this.isCategoryRoute = url === '/categories';
      });
  }

  ngOnInit() {
    this.years = Array.from({ length: 5 }, (_, i) => this.currentYear - i);
    this.year = this.currentYear;
    this.month = new Date().getMonth() + 1;
    this.onFilterChange();
  }

  openLocalStorage() {
    const pass = prompt('Enter password:');
    if (!pass) return;

    this.loggerService.setShowLogs(pass);
  }

  onFilterChange() {
    this.year = +this.year;
    this.month = +this.month;
    this.filterService.setYear(this.year);
    this.filterService.setMonth(this.month);
  }

  onWelcomeFinished() {
    this.showWelcome = false;
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
