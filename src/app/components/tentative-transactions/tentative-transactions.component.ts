import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterService, LoggerService, SmsService, TransactionsService } from '../../services';
import { ITentativeTransaction, Transaction } from '../../interfaces';
import { Capacitor } from '@capacitor/core';
import { generateHexId } from '../../utils';
import { MatDialog } from '@angular/material/dialog';
import { DivisionSelectorDialogComponent } from '../division-selector-dialog/division-selector-dialog.component';
import { Subject, interval, merge, take, takeUntil } from 'rxjs';
import { tempTentativeTransaction } from '../../configs';

@Component({
  selector: 'app-tentative-transactions',
  templateUrl: './tentative-transactions.component.html',
  styleUrl: './tentative-transactions.component.scss'
})
export class TentativeTransactionsComponent implements OnInit, OnDestroy {
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
    private dialog: MatDialog, private filterService: FilterService) { }

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
    if (Capacitor.getPlatform() !== 'web') {
      const dateRange = this.getMonthTimestamps(this.filterService.getCurrentYear(), this.filterService.getCurrentMonth())
      setTimeout(async () => {
        const tentativeTransactions = await this.sms.readMessages(dateRange.start, dateRange.end);
        this.tentativeTransactions = this.filterByState(tentativeTransactions);
        this.loggerService.log(this.tentativeTransactions.length);
        this.isLoaderActive = false;
      }, 100);
    }
    else {
      const tentativeTransactions: ITentativeTransaction[] = tempTentativeTransaction;
      interval(3000).pipe(take(1))
        .subscribe(() => {
          this.tentativeTransactions = this.filterByState(tentativeTransactions);

          this.isLoaderActive = false;
        });
    }
  }

  filterByState(tentativeTransactions: ITentativeTransaction[]): ITentativeTransaction[] {
    return tentativeTransactions.filter(t => !this.sms.confirmedMessageIds.has(t.id) && !this.sms.deletedMessagesIds.has(t.id))
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
    this.loadTentative();
  }

  delete(tentative: ITentativeTransaction) {
    this.sms.addDeletedMessageId(tentative.id);
    this.loadTentative();
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
