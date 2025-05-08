import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryService, TransactionsService } from '../../services';
import { ITransactionCategoryCrudEnabled, Transaction } from '../../interfaces';
// import { TransactionCategories } from '../../configs';
import { generateHexId } from '../../utils';
import { DivisionSelectorDialogComponent } from '../';
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
  categories: ITransactionCategoryCrudEnabled[] = [];
  selectedTabIndex: number = 0;
  searchTerm: string = '';
  dateDisabled = false;

  get filteredCategories(): ITransactionCategoryCrudEnabled[] {
    if (!this.searchTerm.trim()) return [];

    const lower = this.searchTerm.toLowerCase();
    return this.categories
      .map(c => ({
        category: c.category,
        staticDivisions: c.staticDivisions.filter(d => d.toLowerCase().includes(lower) || c.category.toLowerCase().includes(lower)),
        dynamicDivisions: c.dynamicDivisions.filter(d => d.toLowerCase().includes(lower) || c.category.toLowerCase().includes(lower)),
        matIcon: c.matIcon
      }))
      .filter(c => c.staticDivisions.length > 0 || c.dynamicDivisions.length > 0);
  }

  constructor(
    private dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    private transactionService: TransactionsService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private categoryService: CategoryService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Transaction
  ) {
    this.editTransaction = this.data;
  }

  ngOnInit(): void {
    if (this.editTransaction) this.loadEditTransaction();
    this.categories = this.categoryService.allCategories;
  }

  loadEditTransaction() {
    if (!this.editTransaction) return;

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

  hasDateBeenEdited(): boolean { // only used for edit functionality
    if (!this.editTransaction) return false;

    const dt1 = new Date(this.editTransaction.date);
    const dt2 = new Date(this.date);
    return dt1.getFullYear() !== dt2.getFullYear() || dt1.getMonth() !== dt2.getMonth() || dt1.getDate() !== dt2.getDate();
  }

  updateTransaction() {
    if (!this.editTransaction) return;

    const dateToSave = !this.hasDateBeenEdited() ? this.editTransaction.date : new Date(this.date).toString();
    this.transactionService.updateTransaction({
      ...this.editTransaction,
      amount: this.transactionType === 'debit' ? -Math.abs(this.amount) : Math.abs(this.amount),
      description: this.description,
      transactionType: this.transactionType,
      category: this.selectedDivision,
      date: dateToSave
    });
  }

  close() {
    this.dialogRef.close();
  }
}
