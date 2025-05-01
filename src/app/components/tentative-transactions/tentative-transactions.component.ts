import { Component } from '@angular/core';
import { TransactionsService } from '../../services';

@Component({
  selector: 'app-tentative-transactions',
  templateUrl: './tentative-transactions.component.html',
  styleUrl: './tentative-transactions.component.scss'
})
export class TentativeTransactionsComponent {
  tentativeTransactions: any[] = [];

  selectedValues: {
    [id: string]: {
      amount?: number;
      description?: string;
      type?: 'credit' | 'debit';
    };
  } = {};

  constructor(private transactionService: TransactionsService) {}

  ngOnInit(): void {
    this.loadTentative();
  }

  loadTentative() {
    this.tentativeTransactions = this.transactionService.getTentativeTransactions();
  }

  selectValue(id: string, key: 'amount' | 'description' | 'type', value: any) {
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

  confirm(tentative: any) {
    const values = this.selectedValues[tentative.id] || {};
    if (!values.amount || !values.description || !values.type) {
      alert('Please complete amount, description, and type.');
      return;
    }

    const transaction = {
      amount: values.type === 'debit' ? -Math.abs(values.amount) : Math.abs(values.amount),
      description: values.description,
      transactionType: values.type
    };

    this.transactionService.confirmTentative(tentative.id, transaction);
    this.loadTentative();
  }
}
