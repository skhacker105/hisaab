import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITransactionCategoryCrudEnabled, ITransactionCategory } from '../../interfaces';
import { IconPickerDialogComponent } from '../';
import { CategoryService } from '../../services';
import { take } from 'rxjs';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrl: './category-manager.component.scss'
})
export class CategoryManagerComponent implements OnInit {
  categories: ITransactionCategoryCrudEnabled[] = [];
  originalState: string = '';
  activeTabIndex = 0;
  pendingChanges = false;

  constructor(private dialog: MatDialog, private categoryService: CategoryService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    const all = this.categoryService.getAllCategoriesCopy();
    const defaults = this.categoryService.defaultCategories;
  
    this.categories = all.map(c => {
      const defaultCategory = defaults.find(def => def.category.toLowerCase() === c.category.toLowerCase());
      const defaultDivisions = defaultCategory?.divisions || [];
  
      const staticDivisions: string[] = [];
      const dynamicDivisions: string[] = [];
  
      for (const div of c.divisions) {
        if (defaultDivisions.includes(div)) {
          staticDivisions.push(div);
        } else {
          dynamicDivisions.push(div);
        }
      }
  
      return {
        category: c.category,
        matIcon: c.matIcon,
        staticDivisions,
        dynamicDivisions
      };
    });
  
    this.originalState = JSON.stringify(this.categories);
  }
  

  saveChanges() {
    const toSave: ITransactionCategory[] = this.categories.map(c => ({
      category: c.category,
      divisions: [...c.staticDivisions, ...c.dynamicDivisions],
      matIcon: c.matIcon
    }));

    this.categoryService.saveCategories(toSave);
    this.pendingChanges = false;
    this.originalState = JSON.stringify(this.categories);
  }

  resetChanges() {
    this.loadCategories();
    this.pendingChanges = false;
  }

  openIconPicker() {
    const dialogRef = this.dialog.open(IconPickerDialogComponent, { width: '95%', height: '95%' });

    dialogRef.afterClosed().pipe(take(1)).subscribe(selectedIcon => {
      if (selectedIcon) {
        this.categories[this.activeTabIndex].matIcon = selectedIcon;
        this.pendingChanges = true;
      }
    });
  }

  onCategoryChange() {
    this.pendingChanges = true;
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
