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
  totalCredit = 0;
  totalDebit = 0;
  year!: number;
  month!: number;

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
    const all = this.transactionService.getTransactionsForMonth(this.year, this.month);
    this.transactions = all;
    this.totalCredit = all.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    this.totalDebit = all.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
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
