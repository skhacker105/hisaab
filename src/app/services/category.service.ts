import { Injectable } from '@angular/core';
import { IFavoriteDivision, ITransactionCategoryCrudEnabled } from '../interfaces';
import { TransactionCategories } from '../configs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private localStorageKey = 'savedCategories';
  private favoritesStorageKey = 'favoriteCategories';

  defaultCategories: ITransactionCategoryCrudEnabled[] = TransactionCategories;

  favoritesDivisions = new Map<string, IFavoriteDivision>();
  allCategories: ITransactionCategoryCrudEnabled[] = [];

  get favoriteDivisions(): string[] {
    return Array.from(this.favoritesDivisions.keys())
      .reduce((arr, f) => {
        const fd = this.favoritesDivisions.get(f);
        if (!fd) return arr;

        arr.push(fd);
        return arr;
      }, [] as IFavoriteDivision[])
      .sort((a, b) => (b?.usedCounts ?? 0) - (a?.usedCounts ?? 0))
      .map(fd => fd?.division);
  }

  constructor(private loggerService: LoggerService) {
    localStorage.removeItem('userCategories'); // removing previous garbage data
    this.loadFavoriteDivisions();
    this.loadCategories();
  }

  private loadCategories(): void {
    const saved = localStorage.getItem(this.localStorageKey);
    const parsed = saved ? JSON.parse(saved) : undefined;
    this.allCategories = parsed ?? this.defaultCategories;
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

  getCategoryFromDivision(division: string): string {
    return this.allCategories.find(c => c.staticDivisions.includes(division) || c.dynamicDivisions.includes(division))?.category ?? ''
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

  toggleFavoriteDivision(division: string) {
    const existingFav = this.favoritesDivisions.get(division);
    const existingCategory = this.allCategories.find(c => c.staticDivisions.includes(division) || c.dynamicDivisions.includes(division));
    if (!existingCategory) return;

    if (!existingFav)
      this.addFavoriteDivision(existingCategory.category, division, 'selectedAsFavorite');
    else
      this.removeFavoriteDivision(division);
  }
}
