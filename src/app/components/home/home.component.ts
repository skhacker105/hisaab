import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterService, SmsService, TransactionsService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionDialogComponent, SmsDetailsDialogComponent } from '../';
import { ITransactionCategorySummary, Transaction } from '../../interfaces';
import { Subject, takeUntil } from 'rxjs';
import { TransactionCategories } from '../../configs';
import { sortTransactionsByDateDesc } from '../../utils';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('drawerAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
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

  categorySummaries: ITransactionCategorySummary[] = [];
  selectedCategory: ITransactionCategorySummary | undefined;

  selectionMode = false;
  selectedIds = new Set<string>();


  get monthName(): string {
    return this.filterService.months.find(m => m.value == this.month)?.name ?? '';
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  constructor(
    private transactionService: TransactionsService,
    private filterService: FilterService,
    private dialog: MatDialog,
    private sms: SmsService,
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
    setTimeout(() => {
      const allForMonth = this.transactionService.getTransactionsForMonth(this.year, this.month);
      const allForYear = this.transactionService.getTransactionsForYear(this.year);

      this.transactions = sortTransactionsByDateDesc(allForMonth);
      this.calculateCategoryTotals();
      if (showHideTentativeTransactions) this.showHideTentativeTransaction();

      this.monthlyExpenditure = allForMonth
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      this.yearlyExpenditure = allForYear
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    }, 200);
  }

  calculateCategoryTotals() {
    this.categorySummaries = this.transactionCategories.map(cat => {
      const total = this.transactions
        .filter(t => t.amount < 0 && cat.divisions.includes((t.category ?? '')))
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        icon: cat.matIcon,
        name: cat.category,
        total
      };
    }).filter(summary => summary.total !== 0); // optional: hide zero total categories
  }

  showHideTentativeTransaction() {
    if (this.transactions.length === 0) this.showTentativeTransaction = true;
    else this.showTentativeTransaction = false;
  }

  showSmsSourceDetails(transaction: Transaction) {
    const smsDetails = this.transactionService.getTransactionById(transaction.id);
    if (smsDetails) {
      this.dialog.open(SmsDetailsDialogComponent, {
        data: smsDetails,
        width: '400px'
      });
    }
  }

  toggleDrawer(t: Transaction, event: MouseEvent) {
    event.stopPropagation();
    this.transactions.forEach(tx => tx.showDrawer = false);
    t.showDrawer = true;
  }

  closeAllDrawers() {
    this.transactions.forEach(tx => tx.showDrawer = false);
  }

  editTransaction(t: Transaction) {
    t.showDrawer = false;
    this.dialog.open(AddTransactionDialogComponent, {
      width: '400px',
      data: t
    });
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

  selectDelectTransactions(category: ITransactionCategorySummary) {
    if (this.selectedCategory && this.selectedCategory.name === category.name) this.selectedCategory = undefined;
    else this.selectedCategory = category;
  }

  transactionInSelectedCategory(t: Transaction): boolean {
    if (!this.selectedCategory) return true;

    const cat = this.transactionCategories.find(c => c.divisions.includes((t.category ?? '')));
    return cat && cat.category === this.selectedCategory.name ? true : false;
  }

  toggleSelection(id: string) {
    this.selectedIds.has(id)
      ? this.selectedIds.delete(id)
      : this.selectedIds.add(id);
  }

  onSwipeRight() {
    this.selectionMode = true;
  }

  onSwipeLeft() {
    this.selectionMode = false;
    this.selectedIds.clear();
  }

  deleteSelected() {
    if (this.selectedCount === 0) return;

    const confirmDelete = confirm(`Are you sure to delete ${this.selectedCount} transaction?`);
    if (!confirmDelete) return;

    this.transactions.forEach(t => {
      if (!this.selectedIds.has(t.id)) return;

      this.transactionService.removeTransaction(t);
      if (t.tentative)
        this.sms.removeConfirmedMessageId(t.tentative.id);
      
    });
    this.selectedIds.clear();
    this.selectionMode = false;
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }
}
