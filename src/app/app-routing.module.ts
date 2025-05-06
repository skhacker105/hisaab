import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryManagerComponent, HomeComponent, SpendByCategoryChartComponent, TentativeTransactionsComponent } from './components';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tentative', component: TentativeTransactionsComponent },
  { path: 'charts', component: SpendByCategoryChartComponent },
  { path: 'categories', component: CategoryManagerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
