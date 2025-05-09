import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HomeComponent, TentativeTransactionsComponent, AddTransactionDialogComponent, SmsDetailsDialogComponent, DivisionSelectorDialogComponent,
  SpendByCategoryChartComponent, CategoryManagerComponent, IconPickerDialogComponent, LocalStorageComponent, LogsComponent, DevloperOptionComponent,
  WelcomeScreenComponent, ProdWebHomePageComponent
} from './components';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';

import { SwipeDirective } from './directives/swipe.directive';
import { LongPressDirective } from './directives/long-press.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TentativeTransactionsComponent,
    AddTransactionDialogComponent,
    SmsDetailsDialogComponent,
    DivisionSelectorDialogComponent,
    SpendByCategoryChartComponent,
    SwipeDirective,
    CategoryManagerComponent,
    IconPickerDialogComponent,
    LongPressDirective,
    LocalStorageComponent,
    LogsComponent,
    DevloperOptionComponent,
    WelcomeScreenComponent,
    ProdWebHomePageComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    NgChartsModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      timeOut: 1500,
      preventDuplicates: true,
    })
  ],
  providers: [
    provideAnimationsAsync(),
    AndroidPermissions,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
