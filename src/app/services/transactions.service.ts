import { Injectable } from '@angular/core';
import { Transaction } from '../interfaces';
import { Subject } from 'rxjs';
import { IndexedDbService } from './indexed-db.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private storageKey = 'transactions';
  private transactions: Transaction[] = [];
  transactionsChanged = new Subject<Transaction[]>();

  constructor(private dbService: IndexedDbService, private loggerService: LoggerService) {
    setTimeout(() => {
      this.migrateFromLocalStorage().then(() => this.loadTransactions());
    }, 100);
  }

  private async loadTransactions() {
    const data = await this.dbService.getAll<Transaction>();
    this.transactions = data;
    this.updateBlankCategories();
    this.transactionsChanged.next(this.transactions);
  }

  async migrateFromLocalStorage(): Promise<void> {
    const saved = localStorage.getItem(this.storageKey);

    if (!saved) return;

    try {
      const transactions: Transaction[] = JSON.parse(saved);

      // Optional: avoid duplicates if IndexedDB already has data
      const existing = await this.dbService.getAll<Transaction>();
      const existingIds = new Set(existing.map(t => t.id));

      for (const tx of transactions) {
        if (!existingIds.has(tx.id)) {
          await this.dbService.put(tx);
        }
      }

      // Remove from localStorage
      localStorage.removeItem(this.storageKey);
      this.loggerService.log('Migration complete: Transactions moved to IndexedDB');
    } catch (err) {
      this.loggerService.log({ message: 'Failed to migrate from localStorage:', error: err });
    }
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

  async addTransaction(transactionData: Transaction, tentativeId?: string) {
    const old = tentativeId ? this.transactions.find(t => t.tentative?.id === tentativeId) : undefined;
    if (!old) {
      this.transactions.push(transactionData);
      this.transactionsChanged.next(this.transactions);
      await this.dbService.put(transactionData);
    }
  }

  async removeTransaction(transactionData: Transaction) {
    const index = this.transactions.findIndex(t => t.id === transactionData.id);
    if (index === -1) return;

    this.transactions.splice(index, 1);
    this.transactionsChanged.next(this.transactions);
    await this.dbService.delete(transactionData.id);
  }

  async updateTransaction(transactionData: Transaction) {
    const index = this.transactions.findIndex(t => t.id === transactionData.id);
    if (index === -1) return;

    this.transactions[index] = transactionData;
    this.transactionsChanged.next(this.transactions);
    await this.dbService.put(transactionData);
  }

  getTransactionById(transactionId: string): Transaction | undefined {
    return this.transactions.find(t => t.id === transactionId && !!t.tentative);
  }
}
