import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterService, SmsService, TransactionsService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { SmsDetailsDialogComponent } from '../';
import { Transaction } from '../../interfaces';
import { Subject, takeUntil } from 'rxjs';
import { TransactionCategories } from '../../configs';
import { sortTransactionsByDateDesc } from '../../utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  monthlyExpenditure = 0;
  yearlyExpenditure = 0;
  year!: number;
  month!: number;

  transactionCategories = TransactionCategories;

  isComponentActive = new Subject<boolean>();
  showTentativeTransaction = false;

  get monthName(): string {
    return this.filterService.months.find(m => m.value == this.month)?.name ?? '';
  }

  constructor(
    private transactionService: TransactionsService,
    private filterService: FilterService,
    private dialog: MatDialog,
    private sms: SmsService
  ) { }

  ngOnInit(): void {
    this.filterService.year$
      .pipe(takeUntil(this.isComponentActive))
      .subscribe(year => {
        this.year = year;
        this.loadTransactions(true);
      });

    this.filterService.month$
      .pipe(takeUntil(this.isComponentActive))
      .subscribe(month => {
        this.month = month;
        this.loadTransactions(true);
      });

    this.transactionService.transactionsChanged
      .pipe(takeUntil(this.isComponentActive))
      .subscribe(transactions => {
        this.loadTransactions();
      });
  }

  ngOnDestroy(): void {
    this.isComponentActive.next(true);
    this.isComponentActive.complete();
  }

  loadTransactions(showHideTentativeTransactions = false) {
    const allForMonth = this.transactionService.getTransactionsForMonth(this.year, this.month);
    const allForYear = this.transactionService.getTransactionsForYear(this.year);

    this.transactions = sortTransactionsByDateDesc(allForMonth);
    if (showHideTentativeTransactions) this.showHideTentativeTransaction();

    this.monthlyExpenditure = allForMonth
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    this.yearlyExpenditure = allForYear
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }

  showHideTentativeTransaction() {
    if (this.transactions.length === 0) this.showTentativeTransaction = true;
    else this.showTentativeTransaction = false;
  }

  showSmsSourceDetails(transaction: Transaction) {
    const smsDetails = this.transactionService.getMessageDetailsByTransactionId(transaction.id);
    if (smsDetails) {
      this.dialog.open(SmsDetailsDialogComponent, {
        data: smsDetails,
        width: '400px'
      });
    }
  }

  deleteTransaction(transaction: Transaction) {
    const confirmDelete = confirm('Are you sure to delete this transaction?');
    if (!confirmDelete) return;

    this.transactionService.removeTransaction(transaction);
    if (transaction.tentative)
      this.sms.removeConfirmedMessageId(transaction.tentative.id);
  }

  getTransactionCategoryIcon(transaction: Transaction): string | undefined {
    if (!transaction.category) return;

    const category = this.transactionCategories.find(t => transaction.category && t.divisions.includes(transaction.category));
    if (!category) return;

    return category.matIcon;
  }
}
