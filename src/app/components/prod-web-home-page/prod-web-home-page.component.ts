import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../';

type TabType = 'welcome' | 'install' | 'usage' | 'about';

@Component({
  selector: 'app-prod-web-home-page',
  templateUrl: './prod-web-home-page.component.html',
  styleUrl: './prod-web-home-page.component.scss'
})
export class ProdWebHomePageComponent {
  
  currentTab: 'app' | 'me' = 'app';
  activeTab: TabType = 'welcome';
  installStepIndex = 0;
  usageStepIndex = 0;

  installSteps = [
    { text: 'Open Play Store', img: '1.jpeg' },
    { text: 'Click your account icon (top-right)', img: '2.jpeg' },
    { text: 'Click "Play Protect"', img: '3.jpeg' },
    { text: 'Click settings (top-right)', img: '4.jpeg' },
    { text: 'Disable both toggles', img: '5.jpeg' },
    { text: '', img: '6.jpeg' },
    { text: 'Download the app and click Install', img: '', file: { type: 'apk', src: 'app-debug' } },
    { text: 'Re-enable both Play Protect toggles', img: '5.jpeg' },
    { text: 'Open the "Hisaab" app and allow SMS read permission', img: '7.jpeg' }
  ];

  usageSteps = [
    { text: 'Select potential transaction messages and confirm with the tick icon', img: 'use1.png' },
    { text: 'Convert or delete messages as needed', img: 'use2.png' },
    { text: 'Navigate or reopen the app to view categorized transactions and bar charts', img: 'use3.png' },
    { text: '', img: 'use4.png' },
    { text: '', img: 'use5.png' }
  ];

  constructor(private dialog: MatDialog) {}

  nextStep(type: TabType) {
    if (type === 'install' && this.installStepIndex < this.installSteps.length - 1) {
      this.installStepIndex++;
    } else if (type === 'usage' && this.usageStepIndex < this.usageSteps.length - 1) {
      this.usageStepIndex++;
    }
  }

  prevStep(type: TabType) {
    if (type === 'install' && this.installStepIndex > 0) {
      this.installStepIndex--;
    } else if (type === 'usage' && this.usageStepIndex > 0) {
      this.usageStepIndex--;
    }
  }

  goToStep(type: TabType, index: number) {
    if (type === 'install') this.installStepIndex = index;
    else this.usageStepIndex = index;
  }

  openImageDialog(imgPath: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imgPath },
      panelClass: 'custom-dialog-container'
    });
  }

  setTab(tab: 'app' | 'me') {
    this.currentTab = tab;
  }
}
