import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private storageKey = 'transactions';
  private transactions: any[] = [];

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    this.transactions = saved ? JSON.parse(saved) : [];
  }

  getTransactions() {
    return [...this.transactions];
  }

  getTransactionsForMonth(year: number, month: number) {
    return this.transactions.filter(t => {
      const date = new Date(t.timestamp);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addTransaction(transaction: any) {
    this.transactions.push(transaction);
    this.save();
  }

  addTentativeTransactions(transactions: any[]) {
    transactions.forEach(t => {
      if (!this.transactions.some(existing => existing.sourceId === t.sourceId)) {
        this.transactions.push(t);
      }
    });
    this.save();
  }

  getTentativeTransactions() {
    return this.transactions.filter(t => t.tentative);
  }

  confirmTentative(tentativeId: string, confirmedData: any) {
    const index = this.transactions.findIndex(t => t.id === tentativeId);
    if (index !== -1) {
      this.transactions[index] = {
        ...confirmedData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        source: 'sms',
        sourceId: this.transactions[index].sourceId
      };
      this.save();
    }
  }

  getMessageDetailsByTransactionId(transactionId: string) {
    return this.transactions.find(t => t.id === transactionId && t.source === 'sms');
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
  }
}
