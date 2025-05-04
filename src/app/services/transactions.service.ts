import { Injectable } from '@angular/core';
import { Transaction } from '../interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private storageKey = 'transactions';
  private transactions: Transaction[] = [];
  transactionsChanged = new Subject<Transaction[]>();

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    this.transactions = saved
      ? JSON.parse(saved)
      : [];

    this.updateBlankCategories()
  }

  updateBlankCategories() {
    this.transactions.forEach(t => {
      if (t.category) return;

      t.category = 'Others';
    });
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  getTransactionsForMonth(year: number, month: number): Transaction[] {
    return this.transactions
      .filter(t => new Date(t.date).getFullYear() === year && new Date(t.date).getMonth() + 1 === month)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getTransactionsForYear(year: number): Transaction[] {
    return this.transactions.filter(t => new Date(t.date).getFullYear() === year);
  }

  addTransaction(transactionData: Transaction, tentativeId?: string): void {
    const old = tentativeId ? this.transactions.find(t => t.tentative?.id === tentativeId) : undefined;
    if (!old) {
      this.transactions.push(transactionData);
      this.transactionsChanged.next(this.transactions);
      this.save();
    }
  }

  removeTransaction(transactionData: Transaction) {
    const index = this.transactions.findIndex(t => t.id === transactionData.id);
    if (index === -1) return;

    this.transactions.splice(index, 1);
    this.transactionsChanged.next(this.transactions);
    this.save();
  }

  updateTransaction(transactionData: Transaction) {
    const index = this.transactions.findIndex(t => t.id === transactionData.id);
    if (index === -1) return;

    this.transactions[index] = transactionData;
    this.transactionsChanged.next(this.transactions);
    this.save();
  }

  getMessageDetailsByTransactionId(transactionId: string): Transaction | undefined {
    return this.transactions.find(t => t.id === transactionId && !!t.tentative);
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
  }
}
