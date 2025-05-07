import { Injectable } from '@angular/core';
import { IFavoriteDivision, ITransactionCategoryCrudEnabled } from '../interfaces';
import { TransactionCategories } from '../configs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private localStorageKey = 'userCategories';
  private favoritesStorageKey = 'favoriteCategories';

  defaultCategories: ITransactionCategoryCrudEnabled[] = TransactionCategories;

  favoritesDivisions = new Map<string, IFavoriteDivision>();
  allCategories: ITransactionCategoryCrudEnabled[] = [];

  constructor() {
    this.loadFavoriteDivisions();
    this.loadCategories();
  }

  private loadCategories(): void {
    const saved = localStorage.getItem(this.localStorageKey);
    this.allCategories = saved ? JSON.parse(saved) : this.defaultCategories;
  }

  private loadFavoriteDivisions(): void {
    const saved = localStorage.getItem(this.favoritesStorageKey);
    if (!saved) return;

    const parsed = JSON.parse(JSON.parse(saved));
    this.favoritesDivisions = new Map<string, IFavoriteDivision>(parsed);
  }

  getAllCategoriesCopy(): ITransactionCategoryCrudEnabled[] {
    return JSON.parse(JSON.stringify(this.allCategories)); // deep copy
  }

  saveCategories(edited: ITransactionCategoryCrudEnabled[]): void {
    this.allCategories = edited;
    localStorage.setItem(this.localStorageKey, JSON.stringify(edited));
  }

  private saveFavoritesDivisions(): void {
    const fav = JSON.stringify(Array.from(this.favoritesDivisions.entries()));
    localStorage.setItem(this.favoritesStorageKey, JSON.stringify(fav));
  }

  addFavoriteDivision(category: string, division: string, source: 'usedForTransaction' | 'selectedAsFavorite'): void {
    const existingDivision = this.favoritesDivisions.get(division);
    if (existingDivision) {
      existingDivision.usedCounts += 1;
      existingDivision.updatedOn = new Date().toString();

    } else
      this.favoritesDivisions.set(division, {
        category,
        division,
        addedOn: new Date().toString(),
        usedCounts: source === 'usedForTransaction' ? 1 : 0
      });
      this.saveFavoritesDivisions();
  }

  removeFavoriteDivision(division: string) {
    this.favoritesDivisions.delete(division);
    this.saveFavoritesDivisions();
  }
}
