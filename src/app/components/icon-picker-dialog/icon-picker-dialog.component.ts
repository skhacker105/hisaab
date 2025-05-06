import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { allMaterialIcons } from '../../configs';

@Component({
  selector: 'app-icon-picker-dialog',
  templateUrl: './icon-picker-dialog.component.html',
  styleUrl: './icon-picker-dialog.component.scss'
})
export class IconPickerDialogComponent {

  allIcons = allMaterialIcons;
  seachText = '';

  constructor(
    public dialogRef: MatDialogRef<IconPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectIcon(icon: string) {
    this.dialogRef.close(icon);
  }

  isIconMatching(icon: string): boolean {
    if (!this.seachText) return true;

    return icon.indexOf(this.seachText) >= 0;
  }
  
}
