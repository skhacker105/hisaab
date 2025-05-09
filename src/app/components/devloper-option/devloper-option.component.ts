import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { LocalStorageComponent, LogsComponent } from '../';
import { MatIconModule } from '@angular/material/icon';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-devloper-option',
  templateUrl: './devloper-option.component.html',
  styleUrl: './devloper-option.component.scss'
})
export class DevloperOptionComponent {

  constructor(public loggerService: LoggerService) {
    console.log('DevloperOptionComponent')
  }


  hideLogs() {
    this.loggerService.resetShowLogs();
  }

}
