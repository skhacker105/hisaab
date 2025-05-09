import { Component } from '@angular/core';

@Component({
  selector: 'app-prod-web-home-page',
  templateUrl: './prod-web-home-page.component.html',
  styleUrl: './prod-web-home-page.component.scss'
})
export class ProdWebHomePageComponent {
  currentTab: 'app' | 'me' = 'app';
  activeTab: 'install' | 'usage' | 'about' = 'install';

  installSteps = [
    { text: 'Open Play Store', img: '' },
    { text: 'Click your account icon (top-right)', img: '' },
    { text: 'Click "Play Protect"', img: '' },
    { text: 'Click settings (top-right) and disable both toggles', img: '' },
    { text: 'Download the app and click Install', img: '', file: {type: 'apk', src: 'app-debug'} },
    { text: 'Re-enable both Play Protect toggles', img: '' },
    { text: 'Open the "Hisaab" app and allow SMS read permission', img: '' }
  ];

  usageSteps = [
    { text: 'Select potential transaction messages and confirm with the tick icon', img: '' },
    { text: 'Convert or delete messages as needed', img: '' },
    { text: 'Navigate or reopen the app to view categorized transactions and bar charts', img: '' }
  ];

  setTab(tab: 'app' | 'me') {
    this.currentTab = tab;
  }
}
