import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TransactionsService } from '../../services';

@Component({
  selector: 'app-add-transaction-dialog',
  templateUrl: './add-transaction-dialog.component.html',
  styleUrl: './add-transaction-dialog.component.scss'
})
export class AddTransactionDialogComponent {
  amount!: number;
  description!: string;
  transactionType: 'credit' | 'debit' = 'debit';

  constructor(
    private dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    private transactionService: TransactionsService
  ) { }

  save() {
    if (this.amount && this.description && this.transactionType) {
      this.transactionService.addTransaction({
        amount: this.transactionType === 'debit' ? -Math.abs(this.amount) : Math.abs(this.amount),
        description: this.description,
        transactionType: this.transactionType,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        source: 'manual'
      });
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
