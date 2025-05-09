import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { TransactionCategories } from '../../configs';
import { ITransactionCategoryCrudEnabled } from '../../interfaces';
import { CategoryService } from '../../services';

@Component({
  selector: 'app-division-selector-dialog',
  templateUrl: './division-selector-dialog.component.html',
  styleUrls: ['./division-selector-dialog.component.scss']
})
export class DivisionSelectorDialogComponent implements OnInit {
  categories: ITransactionCategoryCrudEnabled[] = []; // Replace with your actual list
  searchText = '';
  filteredCategories: ITransactionCategoryCrudEnabled[] = [];
  favoriteCategories: ITransactionCategoryCrudEnabled[] = [];

  constructor(
    public dialogRef: MatDialogRef<DivisionSelectorDialogComponent>, private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: { selected: string }
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.categories = this.categoryService.allCategories;
      this.favoriteCategories = [{
        category: 'Favorites',
        matIcon: 'favorite',
        staticDivisions: [],
        dynamicDivisions: Array.from(this.categoryService.favoriteDivisions.values())
      }];
      this.filter();
    }, 200);
  }

  filter() {
    const text = this.searchText.toLowerCase();
    this.filteredCategories = [...this.favoriteCategories, ...this.categories]
      .map(cat => {
        const categoryMatch = cat.category.toLowerCase().includes(text);

        if (categoryMatch) {
          return { ...cat };
        }

        const filteredStatic = cat.staticDivisions.filter(div =>
          div.toLowerCase().includes(text)
        );
        const filteredDynamic = cat.dynamicDivisions.filter(div =>
          div.toLowerCase().includes(text)
        );

        if (filteredStatic.length > 0 || filteredDynamic.length > 0) {
          return {
            ...cat,
            staticDivisions: filteredStatic,
            dynamicDivisions: filteredDynamic
          };
        }

        return undefined;
      })
      .filter((cat): cat is ITransactionCategoryCrudEnabled => cat !== undefined);

  }

  isDivisionSelected(division: string): boolean {
    return this.categoryService.favoritesDivisions.has(division);
  }

  toggleFavoriteDivision(division: string, e: any) {
    e.stopPropagation();
    this.categoryService.toggleFavoriteDivision(division);
  }

  select(name: string) {
    this.dialogRef.close(name);
  }
}
