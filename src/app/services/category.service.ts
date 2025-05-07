import { Injectable } from '@angular/core';
import { ITransactionCategoryCrudEnabled } from '../interfaces';
import { TransactionCategories } from '../configs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private localStorageKey = 'userCategories';
  defaultCategories: ITransactionCategoryCrudEnabled[] = TransactionCategories;
  favoritesDivisions: string[] = [];
  allCategories: ITransactionCategoryCrudEnabled[] = [];

  constructor() {
    this.loadCategories();
  }

  private loadCategories(): void {
    const saved = localStorage.getItem(this.localStorageKey);
    this.allCategories = saved ? JSON.parse(saved) : this.defaultCategories;
  }

  getAllCategoriesCopy(): ITransactionCategoryCrudEnabled[] {
    return JSON.parse(JSON.stringify(this.allCategories)); // deep copy
  }

  saveCategories(edited: ITransactionCategoryCrudEnabled[]): void {
    this.allCategories = edited;
    localStorage.setItem(this.localStorageKey, JSON.stringify(edited));
  }
}
