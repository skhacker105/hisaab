import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TransactionsService } from '../../services';
import { ITransactionCategory } from '../../interfaces';
import { TransactionCategories } from '../../configs';

@Component({
  selector: 'app-add-transaction-dialog',
  templateUrl: './add-transaction-dialog.component.html',
  styleUrl: './add-transaction-dialog.component.scss'
})
export class AddTransactionDialogComponent {
  amount!: number;
  description!: string;
  transactionType: 'credit' | 'debit' = 'debit';

  categories: ITransactionCategory[] = TransactionCategories;
  selectedDivision: string | undefined;
  selectedTabIndex: number = 0;
  searchTerm: string = '';

  get filteredCategories(): ITransactionCategory[] {
    if (!this.searchTerm.trim()) return [];

    const lower = this.searchTerm.toLowerCase();
    return this.categories
      .map(c => ({
        category: c.category,
        divisions: c.divisions.filter(d => d.toLowerCase().includes(lower) || c.category.toLowerCase().includes(lower))
      }))
      .filter(c => c.divisions.length > 0);
  }

  constructor(
    private dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    private transactionService: TransactionsService
  ) { }

  selectDivision(division: string) {
    this.selectedDivision = division;
  }

  isSelected(division: string): boolean {
    return this.selectedDivision === division;
  }

  save() {
    if (this.amount && this.description && this.transactionType) {
      this.transactionService.addTransaction({
        amount: this.transactionType === 'debit' ? -Math.abs(this.amount) : Math.abs(this.amount),
        description: this.description,
        transactionType: this.transactionType,
        date: new Date().toString(),
        id: Date.now().toString(),
        source: 'manual',
        category: this.selectedDivision
      });
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
