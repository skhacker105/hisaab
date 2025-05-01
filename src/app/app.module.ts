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

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TentativeTransactionsComponent,
    AddTransactionDialogComponent,
    SmsDetailsDialogComponent
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
    MatButtonToggleModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
