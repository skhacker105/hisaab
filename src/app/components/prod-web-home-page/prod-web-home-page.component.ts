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
    { text: 'Open Play Store', img: '1.jpeg' },
    { text: 'Click your account icon (top-right)', img: '2.jpeg' },
    { text: 'Click "Play Protect"', img: '3.jpeg' },
    { text: 'Click settings (top-right)', img: '4.jpeg' },
    { text: 'Disable both toggles', img: '5.jpeg' },
    { text: '', img: '6.jpeg' },
    { text: 'Download the app and click Install', img: '', file: {type: 'apk', src: 'app-debug'} },
    { text: 'Re-enable both Play Protect toggles', img: '5.jpeg' },
    { text: 'Open the "Hisaab" app and allow SMS read permission', img: '7.jpeg' }
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
