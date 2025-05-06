import { Component, HostListener, OnInit } from '@angular/core';
import { ITransactionCategory, ITransactionCategoryCrudEnabled } from '../../interfaces';
import { TransactionCategories } from '../../configs';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrl: './category-manager.component.scss'
})
export class CategoryManagerComponent  implements OnInit {
  localStorageKey = 'userCategories';
  defaultCategories: ITransactionCategory[] = TransactionCategories;

  categories: ITransactionCategoryCrudEnabled[] = [];
  originalState: string = '';
  activeTabIndex = 0;
  pendingChanges = false;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    const saved = localStorage.getItem(this.localStorageKey);
    const parsed: ITransactionCategory[] = saved ? JSON.parse(saved) : this.defaultCategories;

    this.categories = parsed.map(c => ({
      category: c.category,
      staticDivisions: c.divisions,
      matIcon: c.matIcon,
      dynamicDivisions: []
    }));

    this.originalState = JSON.stringify(this.categories);
  }

  saveChanges() {
    const toSave = this.categories.map(c => ({
      category: c.category,
      divisions: [...c.staticDivisions, ...c.dynamicDivisions],
      matIcon: c.matIcon
    }));
    localStorage.setItem(this.localStorageKey, JSON.stringify(toSave));
    this.pendingChanges = false;
    this.originalState = JSON.stringify(this.categories);
  }

  resetChanges() {
    this.loadCategories();
    this.pendingChanges = false;
  }

  addNewCategory() {
    const name = prompt('Enter new category name:');
    if (!name || name.trim() === '') return;

    if (this.categories.some(c => c.category.toLowerCase() === name.toLowerCase())) {
      alert('Category already exists!');
      return;
    }

    this.categories.push({
      category: name,
      matIcon: 'category',
      staticDivisions: [],
      dynamicDivisions: []
    });
    this.pendingChanges = true;
    this.activeTabIndex = this.categories.length - 1;
  }

  updateCategoryName(index: number, newName: string) {
    if (this.categories.some((c, i) => i !== index && c.category.toLowerCase() === newName.toLowerCase())) {
      alert('Category name already exists!');
      return;
    }
    this.categories[index].category = newName;
    this.pendingChanges = true;
  }

  addDivision(index: number) {
    const name = prompt('Enter new division name:');
    if (name) {
      this.categories[index].dynamicDivisions.push(name);
      this.pendingChanges = true;
    }
  }

  editDivision(index: number, divisionIndex: number) {
    const newName = prompt('Edit division name:', this.categories[index].dynamicDivisions[divisionIndex]);
    if (newName) {
      this.categories[index].dynamicDivisions[divisionIndex] = newName;
      this.pendingChanges = true;
    }
  }

  deleteDivision(index: number, divisionIndex: number) {
    if (confirm('Are you sure you want to delete this division?')) {
      this.categories[index].dynamicDivisions.splice(divisionIndex, 1);
      this.pendingChanges = true;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  handleUnload($event: BeforeUnloadEvent) {
    if (this.pendingChanges) {
      $event.returnValue = true;
    }
  }
}
