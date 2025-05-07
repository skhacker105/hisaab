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

  constructor(
    public dialogRef: MatDialogRef<DivisionSelectorDialogComponent>,private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: { selected: string }
  ) {}

  ngOnInit(): void {
    this.categories = this.categoryService.allCategories;
    this.filter();
  }

  filter() {
    const text = this.searchText.toLowerCase();
    this.filteredCategories = this.categories
      .map(cat => ({
        ...cat,
        staticDivisions: cat.staticDivisions.filter(div =>
          div.toLowerCase().includes(text) ||
          cat.category.toLowerCase().includes(text)
        ),
        dynamicDivisions: cat.dynamicDivisions.filter(div =>
          div.toLowerCase().includes(text) ||
          cat.category.toLowerCase().includes(text)
        )
      }))
      .filter(cat => cat.staticDivisions.length > 0 || cat.dynamicDivisions.length > 0);
  }

  select(name: string) {
    this.dialogRef.close(name);
  }
}
