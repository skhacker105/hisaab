import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent, SpendByCategoryChartComponent, TentativeTransactionsComponent } from './components';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tentative', component: TentativeTransactionsComponent },
  { path: 'charts', component: SpendByCategoryChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
