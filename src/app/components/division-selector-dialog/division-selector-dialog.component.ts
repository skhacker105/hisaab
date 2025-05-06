import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { TransactionCategories } from '../../configs';
import { ITransactionCategory } from '../../interfaces';
import { CategoryService } from '../../services';

@Component({
  selector: 'app-division-selector-dialog',
  templateUrl: './division-selector-dialog.component.html',
  styleUrls: ['./division-selector-dialog.component.scss']
})
export class DivisionSelectorDialogComponent implements OnInit {
  categories: ITransactionCategory[] = []; // Replace with your actual list
  searchText = '';
  filteredCategories: ITransactionCategory[] = [];

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
        divisions: cat.divisions.filter(div =>
          div.toLowerCase().includes(text) ||
          cat.category.toLowerCase().includes(text)
        )
      }))
      .filter(cat => cat.divisions.length > 0);
  }

  select(name: string) {
    this.dialogRef.close(name);
  }
}
