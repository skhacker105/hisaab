import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { allMaterialIcons } from '../../configs';
import { IMaterialIcon } from '../../interfaces';

@Component({
  selector: 'app-icon-picker-dialog',
  templateUrl: './icon-picker-dialog.component.html',
  styleUrl: './icon-picker-dialog.component.scss'
})
export class IconPickerDialogComponent {

  allIcons: IMaterialIcon[] = allMaterialIcons;
  searchText = '';

  constructor(
    public dialogRef: MatDialogRef<IconPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectIcon(icon: IMaterialIcon) {
    this.dialogRef.close(icon.ligature);
  }

  isIconMatching(icon: IMaterialIcon): boolean {
    if (!this.searchText) return true;
  
    const search = this.searchText.toLowerCase();
  
    for (const key in icon) {
      const value = icon[key as keyof IMaterialIcon];
  
      if (typeof value === 'string' && value.toLowerCase().includes(search)) {
        return true;
      }
  
      if (Array.isArray(value) && value.some(item => item.toLowerCase().includes(search))) {
        return true;
      }
    }
  
    return false;
  }
  
  
}
