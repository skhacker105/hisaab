import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent, TentativeTransactionsComponent, AddTransactionDialogComponent, SmsDetailsDialogComponent } from './components';

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

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { DivisionSelectorDialogComponent } from './components/division-selector-dialog/division-selector-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TentativeTransactionsComponent,
    AddTransactionDialogComponent,
    SmsDetailsDialogComponent,
    DivisionSelectorDialogComponent
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
    MatProgressSpinnerModule
  ],
  providers: [
    provideAnimationsAsync(),
    AndroidPermissions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
