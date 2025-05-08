import { Component, HostListener, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITransactionCategoryCrudEnabled } from '../../interfaces';
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

  favoritesTabLoaded = false;
  activeTabIndex = 0;
  pendingChanges = false;

  staticDivisionsCollapsed = true;
  dynamicDivisionsCollapsed = false;

  @ViewChildren('tabItem') tabItems!: QueryList<ElementRef>;

  constructor(private dialog: MatDialog, private categoryService: CategoryService) { }

  get favoriteDivisions(): string[] {
    return Array.from(this.categoryService.favoritesDivisions.keys());
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categories = this.categoryService.getAllCategoriesCopy();
    this.originalState = JSON.stringify(this.categories);
  }


  saveChanges() {
    this.categoryService.saveCategories(this.categories);
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
    const name = prompt('Enter new Category:');
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
      alert('Category already exists!');
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
      alert('Default Categories cannot be deleted.');
    }
  }


  addDivision(index: number, e: any) {
    e.stopPropagation();
    const name = prompt('Enter new division name:');
    if (!name) return;

    const alreadAvailable = this.categories.find(c => c.staticDivisions.includes(name) || c.dynamicDivisions.includes(name));
    if (alreadAvailable) {
      alert(`${name} already exists under ${alreadAvailable.category}.`);
      return;
    }

    this.categories[index].dynamicDivisions.push(name);
    // this.pendingChanges = true;
    this.saveChanges();
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
    const divisionToDelete = this.categories[index].dynamicDivisions[divisionIndex];
    if (confirm(`Are you sure you want to delete "${divisionToDelete}"?`)) {
      this.categories[index].dynamicDivisions.splice(divisionIndex, 1);
      // this.pendingChanges = true;
      this.categoryService.removeFavoriteDivision(divisionToDelete);
      this.saveChanges();
    }
  }

  toggleStaticDivisions() {
    this.staticDivisionsCollapsed = !this.staticDivisionsCollapsed;
  }

  toggleDynamicDivisions() {
    this.dynamicDivisionsCollapsed = !this.dynamicDivisionsCollapsed;
  }

  isDivisionSelected(division: string): boolean {
    return this.categoryService.favoritesDivisions.has(division);
  }

  toggleFavoriteDivision(division: string, e: any) {
    e.stopPropagation();
    this.categoryService.toggleFavoriteDivision(division);
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
