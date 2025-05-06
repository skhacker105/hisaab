import { Injectable } from '@angular/core';
import { ITransactionCategory } from '../interfaces';
import { TransactionCategories } from '../configs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private localStorageKey = 'userCategories';
  defaultCategories: ITransactionCategory[] = TransactionCategories;
  favoritesDivisions: string[] = [];
  allCategories: ITransactionCategory[] = [];

  constructor() {
    this.loadCategories();
  }

  private loadCategories(): void {
    const saved = localStorage.getItem(this.localStorageKey);
    this.allCategories = saved ? JSON.parse(saved) : this.defaultCategories;
  }

  getAllCategoriesCopy(): ITransactionCategory[] {
    return JSON.parse(JSON.stringify(this.allCategories)); // deep copy
  }

  saveCategories(edited: ITransactionCategory[]): void {
    this.allCategories = edited;
    localStorage.setItem(this.localStorageKey, JSON.stringify(edited));
  }
}
