import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sms-details-dialog',
  templateUrl: './sms-details-dialog.component.html',
  styleUrl: './sms-details-dialog.component.scss'
})
export class SmsDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
