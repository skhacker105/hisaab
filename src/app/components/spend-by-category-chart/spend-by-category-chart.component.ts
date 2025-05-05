import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { FilterService, TransactionsService } from '../../services';
import { Transaction } from '../../interfaces';
import { TransactionCategories } from '../../configs';
import { Subject, merge, takeUntil } from 'rxjs';

@Component({
  selector: 'app-spend-by-category-chart',
  templateUrl: './spend-by-category-chart.component.html',
  styleUrl: './spend-by-category-chart.component.scss'
})
export class SpendByCategoryChartComponent implements OnInit {

  transactions: Transaction[] = [];
  transactionCategories = TransactionCategories;

  isComponentActive = new Subject<boolean>();

  public chartData: ChartDataset<'line'>[] = [];
  public chartLabels: string[] = [];
  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    elements: {
      line: {
        fill: true // This makes it an area chart
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Date' },
      },
      y: {
        title: { display: true, text: 'Amount' },
      }
    }
  };

  constructor(private transactionService: TransactionsService, private filterService: FilterService) { }

  ngOnInit(): void {
    merge(this.filterService.year$, this.filterService.month$)
    .pipe(takeUntil(this.isComponentActive))
    .subscribe(() => {
      this.loadTransactionAndLoadChart();
    })
  }

  loadTransactionAndLoadChart() {
    setTimeout(() => {
      this.transactions = this.filterBySpediture(JSON.parse(JSON.stringify(this.transactionService.getTransactionsForYear(+this.filterService.getCurrentYear()))));
      this.updateDivisionByCategoryName();
      this.generateChart();
    }, 200);
  }

  private filterBySpediture(transactions: Transaction[]): Transaction[] {
    return transactions.filter(t => +t.amount < 0);
  }

  private updateDivisionByCategoryName() {
    this.transactions.forEach(t => {
      if (!t.category) return;

      const category = this.transactionCategories.find(tc => t.category && tc.divisions.includes(t.category));
      
      if (!category) t.category = 'Miscellaneous';
      else t.category = category.category;
    });
  }

  private generateChart() {
    const grouped = new Map<string, { [date: string]: number }>();

    const dates = Array.from(
      new Set(this.transactions.map(t => new Date(t.date).toISOString().split('T')[0]))
    ).sort();

    for (const tx of this.transactions) {
      const date = new Date(tx.date).toISOString().split('T')[0];
      const key = `${tx.category || 'Uncategorized'}`;

      if (!grouped.has(key)) grouped.set(key, {});
      const dataByDate = grouped.get(key)!;
      dataByDate[date] = (dataByDate[date] || 0) + tx.amount;
    }

    this.chartLabels = dates;

    this.chartData = Array.from(grouped.entries()).map(([label, data], i) => ({
      label,
      data: dates.map(d => data[d] || 0),
      borderColor: this.getColor(i),
      backgroundColor: this.getColor(i, 0.3),
      tension: 0.3,
    }));
  }

  private getColor(index: number, alpha = 1): string {
    const colors = [
      `rgba(255, 99, 132, ${alpha})`,
      `rgba(54, 162, 235, ${alpha})`,
      `rgba(255, 206, 86, ${alpha})`,
      `rgba(75, 192, 192, ${alpha})`,
      `rgba(153, 102, 255, ${alpha})`,
      `rgba(255, 159, 64, ${alpha})`,
    ];
    return colors[index % colors.length];
  }

}
