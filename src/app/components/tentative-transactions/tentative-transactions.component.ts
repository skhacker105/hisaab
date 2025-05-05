import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FilterService, LoggerService, SmsService, ToastService, TransactionsService } from '../../services';
import { ITentativeTransaction, Transaction } from '../../interfaces';
import { generateHexId } from '../../utils';
import { MatDialog } from '@angular/material/dialog';
import { DivisionSelectorDialogComponent } from '../division-selector-dialog/division-selector-dialog.component';
import { Subject, merge, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tentative-transactions',
  templateUrl: './tentative-transactions.component.html',
  styleUrl: './tentative-transactions.component.scss'
})
export class TentativeTransactionsComponent implements OnInit, OnDestroy {

  @Input() hideTitile = false;

  tentativeTransactions: ITentativeTransaction[] = [];

  selectedValues: {
    [id: string]: {
      amount?: number;
      description?: string;
      type?: 'credit' | 'debit';
      category?: string;
    };
  } = {};

  isLoaderActive = false;

  isComponentActive = new Subject<boolean>();

  constructor(private transactionService: TransactionsService, public sms: SmsService, private loggerService: LoggerService,
    private dialog: MatDialog, private filterService: FilterService, private toastService: ToastService) { }

  ngOnInit(): void {
    merge(this.filterService.year$, this.filterService.month$)
      .pipe(takeUntil(this.isComponentActive))
      .subscribe(() => this.loadTentative());
  }

  ngOnDestroy(): void {
    this.isComponentActive.next(true);
    this.isComponentActive.complete();
  }

  getMonthTimestamps(year: number, month: number): { start: number; end: number } {
    // month is 1-based for this function, so January = 1, December = 12
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0); // 12:00 AM on the 1st
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // 11:59:59.999 PM on last day

    return {
      start: startDate.getTime(),
      end: endDate.getTime(),
    };
  }

  loadTentative() {
    this.isLoaderActive = true;
    const dateRange = this.getMonthTimestamps(this.filterService.getCurrentYear(), this.filterService.getCurrentMonth())
    setTimeout(async () => {
      const tentativeTransactions = await this.sms.readMessages(dateRange.start, dateRange.end);
      this.tentativeTransactions = this.filterByState(tentativeTransactions);
      this.selectByDefault();
      this.loggerService.log(this.tentativeTransactions.length);
      this.isLoaderActive = false;
    }, 100);
  }

  filterByState(tentativeTransactions: ITentativeTransaction[]): ITentativeTransaction[] {
    return tentativeTransactions.filter(t => !this.sms.confirmedMessageIds.has(t.id) && !this.sms.deletedMessagesIds.has(t.id))
  }

  selectByDefault() {
    this.tentativeTransactions.forEach(t => {

      // Select Amount
      if (t.possibleAmounts.length === 1) this.selectValue(t.id, 'amount', t.possibleAmounts[0])

      // Select Description
      if (t.possibleDescriptions.length === 1) this.selectValue(t.id, 'description', t.possibleDescriptions[0])

      // Select Type - Credit/Debit
      if (t.body.indexOf('Sent') > -1 || t.body.indexOf('debited from') > -1 || t.body.indexOf('deducted') > -1)
        this.selectValue(t.id, 'type', 'debit');
      else if (t.body.indexOf('credited') > -1)
        this.selectValue(t.id, 'type', 'credit');

      // Select Category
      this.selectValue(t.id, 'category', 'Others');

    });
  }

  selectValue(id: string, key: 'amount' | 'description' | 'type' | 'category', value: any) {
    if (!this.selectedValues[id]) {
      this.selectedValues[id] = {};
    }
    this.selectedValues[id][key] = value;
  }

  handleAmountInput(event: Event, id: string) {
    const value = +(event.target as HTMLInputElement).value;
    this.selectValue(id, 'amount', value);
  }

  handleDescriptionInput(event: Event, id: string) {
    const value = (event.target as HTMLInputElement).value;
    this.selectValue(id, 'description', value);
  }

  confirm(tentative: ITentativeTransaction) {
    const values = this.selectedValues[tentative.id] || {};
    if (!values.amount || !values.description || !values.type) {
      alert('Please fill Amount, Description, and Type.');
      return;
    }

    const focusNextTransaction = this.getNextTransactionToFocus(tentative);

    const transaction: Transaction = {
      id: generateHexId(16),
      amount: values.type === 'debit' ? -Math.abs(values.amount) : Math.abs(values.amount),
      description: values.description,
      transactionType: values.type,
      date: tentative.date,
      source: 'phoneMessage',
      tentative,
      category: values.category
    };

    this.transactionService.addTransaction(transaction, tentative.id);
    this.sms.addConfirmedMessageId(tentative.id);
    this.tentativeTransactions = this.filterByState(this.tentativeTransactions);
    this.toastService.success(`SMS converted to transaction`, 'Transaction Created');
    if (focusNextTransaction) this.scrollToTransaction(focusNextTransaction.id);
  }

  remove(tentative: ITentativeTransaction) {
    const confirmDelete = confirm('Are you sure to delete this SMS?');
    if (!confirmDelete) return;

    const focusNextTransaction = this.getNextTransactionToFocus(tentative);

    this.sms.addDeletedMessageId(tentative.id);
    this.tentativeTransactions = this.filterByState(this.tentativeTransactions);
    this.toastService.success(`SMS deleted`);
    if (focusNextTransaction) this.scrollToTransaction(focusNextTransaction.id);
  }

  getNextTransactionToFocus(tentative: ITentativeTransaction): ITentativeTransaction | undefined {
    const index = this.tentativeTransactions.findIndex(t => t.id === tentative.id);
    if (index === -1) return;

    // check next SMS
    const nextSms = this.tentativeTransactions[index + 1];
    if (nextSms) return nextSms;

    // check previous SMS
    const prevSms = this.tentativeTransactions[index - 1];
    return prevSms;
  }

  scrollToTransaction(id: string) {
    setTimeout(() => {
      const el = document.getElementById('tentative-transaction-' + id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Optional: Highlight briefly
        el.classList.add('highlight');
        setTimeout(() => el.classList.remove('highlight'), 2000);
      }
    }, 500);
  }

  openDivisionSelector(tid: string) {
    const dialogRef = this.dialog.open(DivisionSelectorDialogComponent, {
      width: '90vw',
      maxHeight: '80vh',
      data: {
        selected: this.selectedValues[tid]?.category || ''
      },
      autoFocus: false,
      panelClass: 'category-dialog'
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        if (!this.selectedValues[tid]) this.selectedValues[tid] = {};
        this.selectedValues[tid].category = result;
      }
    });
  }

  clearDivision(id: string) {
    if (this.selectedValues[id]) {
      delete this.selectedValues[id].category;
    }
  }

}
