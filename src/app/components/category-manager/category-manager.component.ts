import { Component, HostListener, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITransactionCategoryCrudEnabled, ITransactionCategory } from '../../interfaces';
import { IconPickerDialogComponent } from '../';
import { CategoryService } from '../../services';
import { take } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CanComponentDeactivate } from '../../guards/guards/unsaved-changes.guard';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrl: './category-manager.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ height: '*', opacity: 1, overflow: 'visible' })),
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('expanded <=> collapsed', [animate('300ms ease-in-out')])
    ])
  ]
})
export class CategoryManagerComponent implements OnInit, CanComponentDeactivate {

  categories: ITransactionCategoryCrudEnabled[] = [];
  originalState: string = '';
  activeTabIndex = 0;
  pendingChanges = false;

  staticDivisionsCollapsed = true;
  dynamicDivisionsCollapsed = false;

  @ViewChildren('tabItem') tabItems!: QueryList<ElementRef>;

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
        // this.pendingChanges = true;
        this.saveChanges();
      }
    });
  }

  onCategoryChange() {
    // this.pendingChanges = true;
    this.saveChanges();
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
    // this.pendingChanges = true;
    this.saveChanges();
    this.activeTabIndex = this.categories.length - 1;

    // Wait for view to update and scroll to new tab
    setTimeout(() => {
      const tabEl = this.tabItems?.get(this.activeTabIndex);
      tabEl?.nativeElement?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }, 50);
  }


  updateCategoryName(index: number, newName: string) {
    if (this.isDefaultCategory(index)) {
      alert('Default category names cannot be changed.');
      return;
    }

    if (this.categories.some((c, i) => i !== index && c.category.toLowerCase() === newName.toLowerCase())) {
      alert('Category name already exists!');
      return;
    }

    this.categories[index].category = newName;
    // this.pendingChanges = true;
    this.saveChanges();
  }


  isDefaultCategory(index: number): boolean {
    const name = this.categories[index].category.toLowerCase();
    return this.categoryService.defaultCategories.some(def => def.category.toLowerCase() === name);
  }

  deleteCategory(index: number) {
    if (!this.isDefaultCategory(index)) {
      if (confirm('Are you sure you want to delete this category?')) {
        this.categories.splice(index, 1);
        this.activeTabIndex = Math.max(0, this.activeTabIndex - 1);
        // this.pendingChanges = true;
        this.saveChanges();
      }
    } else {
      alert('Default categories cannot be deleted.');
    }
  }


  addDivision(index: number) {
    const name = prompt('Enter new division name:');
    if (name) {
      this.categories[index].dynamicDivisions.push(name);
      // this.pendingChanges = true;
      this.saveChanges();
    }
  }

  editDivision(index: number, divisionIndex: number) {
    const newName = prompt('Edit division name:', this.categories[index].dynamicDivisions[divisionIndex]);
    if (newName) {
      this.categories[index].dynamicDivisions[divisionIndex] = newName;
      // this.pendingChanges = true;
      this.saveChanges();
    }
  }

  deleteDivision(index: number, divisionIndex: number) {
    if (confirm('Are you sure you want to delete this division?')) {
      this.categories[index].dynamicDivisions.splice(divisionIndex, 1);
      // this.pendingChanges = true;
      this.saveChanges();
    }
  }

  toggleStaticDivisions() {
    this.staticDivisionsCollapsed = !this.staticDivisionsCollapsed;
  }

  toggleDynamicDivisions() {
    this.dynamicDivisionsCollapsed = !this.dynamicDivisionsCollapsed;
  }

  canDeactivate(): boolean {
    if (this.pendingChanges) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  handleUnload($event: BeforeUnloadEvent) {
    if (this.pendingChanges) {
      $event.returnValue = true;
    }
  }

}
