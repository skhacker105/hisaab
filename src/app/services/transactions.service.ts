import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITentativeTransaction, Transaction } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private storageKey = 'transactions';
  private transactions: Transaction[] = [];

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    this.transactions = saved
      ? JSON.parse(saved).map((t: any) => ({
        ...t,
        date: new Date(t.date),
        messageDetails: t.messageDetails
          ? {
            ...t.messageDetails,
            receivedAt: new Date(t.messageDetails.receivedAt)
          }
          : undefined
      }))
      : [];
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

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
    this.save();
  }

  addTentativeTransactions(transactions: Transaction[]): void {
    transactions.forEach(t => {
      if (!this.transactions.some(existing => existing.sourceMessageId === t.sourceMessageId)) {
        this.transactions.push(t);
      }
    });
    this.save();
  }

  confirmTentative(tentativeId: string, confirmedData: Partial<Omit<Transaction, 'id' | 'date'>>): void {
    const index = this.transactions.findIndex(t => t.id === tentativeId);
    if (index !== -1) {
      const old = this.transactions[index];
      this.transactions[index] = {
        ...old,
        ...confirmedData,
        id: Date.now().toString(),
        date: new Date().toString(),
        isTentative: false
      };
      this.save();
    }
  }

  getMessageDetailsByTransactionId(transactionId: string): Transaction | undefined {
    return this.transactions.find(t => t.id === transactionId && !!t.messageDetails);
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
  }
}
