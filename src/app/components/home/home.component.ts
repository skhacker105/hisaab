import { Component } from '@angular/core';
import { FilterService, TransactionsService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { SmsDetailsDialogComponent } from '../';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  transactions: any[] = [];
  monthlyExpenditure = 0;
  yearlyExpenditure = 0;
  year!: number;
  month!: number;

  get monthName(): string {
    return this.filterService.months.find(m => m.value == this.month)?.name ?? '';
  }

  constructor(
    private transactionService: TransactionsService,
    private filterService: FilterService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filterService.year$.subscribe(year => {
      this.year = year;
      this.loadTransactions();
    });

    this.filterService.month$.subscribe(month => {
      this.month = month;
      this.loadTransactions();
    });
  }

  loadTransactions() {
    const allForMonth = this.transactionService.getTransactionsForMonth(this.year, this.month);
    const allForYear = this.transactionService.getTransactionsForYear(this.year);

    this.transactions = allForMonth;

    this.monthlyExpenditure = allForMonth
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    this.yearlyExpenditure = allForYear
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }

  showSmsSourceDetails(transaction: any) {
    const smsDetails = this.transactionService.getMessageDetailsByTransactionId(transaction.id);
    if (smsDetails) {
      this.dialog.open(SmsDetailsDialogComponent, {
        data: smsDetails,
        width: '400px'
      });
    }
  }
}
