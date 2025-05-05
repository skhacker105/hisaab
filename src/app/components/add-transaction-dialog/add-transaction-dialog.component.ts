import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TransactionsService } from '../../services';
import { ITransactionCategory, Transaction } from '../../interfaces';
import { TransactionCategories } from '../../configs';
import { generateHexId } from '../../utils';
import { DivisionSelectorDialogComponent } from '../division-selector-dialog/division-selector-dialog.component';
import { take } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-transaction-dialog',
  templateUrl: './add-transaction-dialog.component.html',
  styleUrl: './add-transaction-dialog.component.scss'
})
export class AddTransactionDialogComponent implements OnInit {

  editTransaction?: Transaction;

  date: string = new Date().toISOString().substring(0, 10); // Default today’s date (yyyy-mm-dd)
  amount!: number;
  description!: string;
  selectedDivision: string | undefined;
  transactionType: 'credit' | 'debit' = 'debit';

  today: string = new Date().toISOString().substring(0, 10);
  categories: ITransactionCategory[] = TransactionCategories;
  selectedTabIndex: number = 0;
  searchTerm: string = '';
  dateDisabled = false;

  get filteredCategories(): ITransactionCategory[] {
    if (!this.searchTerm.trim()) return [];

    const lower = this.searchTerm.toLowerCase();
    return this.categories
      .map(c => ({
        category: c.category,
        divisions: c.divisions.filter(d => d.toLowerCase().includes(lower) || c.category.toLowerCase().includes(lower)),
        matIcon: c.matIcon
      }))
      .filter(c => c.divisions.length > 0);
  }

  constructor(
    private dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    private transactionService: TransactionsService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Transaction
  ) {
    this.editTransaction = this.data;
  }

  ngOnInit(): void {
    if (this.editTransaction) this.loadEditTransaction();
  }

  loadEditTransaction() {
    if (!this.editTransaction) return;

    console.log('this.editTransaction.date = ', this.editTransaction.date)
    this.date = this.datePipe.transform(this.editTransaction.date, 'yyyy-MM-dd') ?? new Date().toString();
    this.amount = Math.abs(this.editTransaction.amount);
    this.description = this.editTransaction.description;
    this.transactionType = this.editTransaction.transactionType;
    this.selectedDivision = this.editTransaction.category;

    if (this.editTransaction.source === 'phoneMessage') this.dateDisabled = true;
  }

  selectDivision(division: string) {
    this.selectedDivision = division;
  }

  isSelected(division: string): boolean {
    return this.selectedDivision === division;
  }

  openDivisionSelector() {
    const dialogRef = this.dialog.open(DivisionSelectorDialogComponent, {
      width: '90vw',
      maxHeight: '80vh',
      data: {
        selected: this.selectedDivision || ''
      },
      autoFocus: false,
      panelClass: 'category-dialog'
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.selectedDivision = result;
      }
    });
  }

  save() {
    console.log('this.date = ', this.date)
    if (this.date && this.amount && this.description && this.transactionType) {
      if (!this.selectedDivision) this.selectedDivision = 'Others';

      if (!this.editTransaction)
        this.saveNewTransaction();
      else
        this.updateTransaction();

      this.dialogRef.close();
    }
  }

  saveNewTransaction() {
    this.transactionService.addTransaction({
      amount: this.transactionType === 'debit' ? -Math.abs(this.amount) : Math.abs(this.amount),
      description: this.description,
      transactionType: this.transactionType,
      date: new Date(this.date).toString(),
      id: generateHexId(),
      source: 'manual',
      category: this.selectedDivision
    });
  }

  updateTransaction() {
    if (!this.editTransaction) return;

    this.transactionService.updateTransaction({
      ...this.editTransaction,
      amount: this.transactionType === 'debit' ? -Math.abs(this.amount) : Math.abs(this.amount),
      description: this.description,
      transactionType: this.transactionType,
      category: this.selectedDivision,
      date: new Date(this.date).toString()
    });
  }

  close() {
    this.dialogRef.close();
  }
}
