import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { FilterService, LoggerService, TransactionsService } from '../../services';
import { Transaction } from '../../interfaces';
import { ChartTransactions, TransactionCategories } from '../../configs';
import { Subject, merge, takeUntil } from 'rxjs';
import 'chartjs-adapter-date-fns'; // Make sure this adapter is installed
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-spend-by-category-chart',
  templateUrl: './spend-by-category-chart.component.html',
  styleUrl: './spend-by-category-chart.component.scss'
})
export class SpendByCategoryChartComponent implements OnInit {

  transactions: Transaction[] = [];
  transactionCategories = TransactionCategories;

  isComponentActive = new Subject<boolean>();

  public chartData: ChartDataset<'bar'>[] = [];
  public chartLabels: string[] = [];
  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      bar: {
        borderRadius: 4, // Rounded corners on bars
        borderSkipped: false // Avoid flat edges at the base
      }
    },
    scales: {
      x: {
        type: 'time', // keep this
        time: {
          unit: 'month',
          tooltipFormat: 'MMM yy',
          displayFormats: {
            month: 'MMM-yy',
          }
        },
        title: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount'
        }
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 10,
        },
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex ?? -1;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(index);

          // Toggle visibility
          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : !meta.hidden;

          ci.update();
        }
      },
    },

  };

  constructor(private transactionService: TransactionsService, private filterService: FilterService, private loggerService: LoggerService) { }

  ngOnInit(): void {
    merge(this.filterService.year$, this.filterService.month$)
      .pipe(takeUntil(this.isComponentActive))
      .subscribe(() => {
        this.loadTransactionAndLoadChart();
      })
  }

  loadTransactionAndLoadChart() {
    setTimeout(() => {
      const isWeb = Capacitor.getPlatform() === 'web';
      this.transactions = !isWeb
        ? this.filterBySpediture(JSON.parse(JSON.stringify(this.transactionService.getTransactionsForYear(+this.filterService.getCurrentYear()))))
        : ChartTransactions;

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

      const category = this.transactionCategories.find(tc => t.category && (tc.divisions.includes(t.category) || tc.category === t.category));

      if (!category) t.category = 'Miscellaneous';
      else t.category = category.category;

      t.amount = Math.abs(t.amount);
    });
  }

  private generateChart() {
    const grouped = new Map<string, { [month: string]: number }>();

    // Generate month labels in 'yyyy-MM' format
    const dates = Array.from(
      new Set(this.transactions.map(t => {
        const d = new Date(t.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }))
    ).sort();

    // Group amounts by category and month
    for (const tx of this.transactions) {
      const d = new Date(tx.date);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const category = tx.category || 'Uncategorized';

      if (!grouped.has(category)) grouped.set(category, {});
      const dataByMonth = grouped.get(category)!;
      dataByMonth[month] = (dataByMonth[month] || 0) + tx.amount;
    }

    // Set labels and datasets
    this.chartLabels = dates;

    this.chartData = Array.from(grouped.entries()).map(([label, data], i) => ({
      label,
      data: dates.map(month => data[month] || 0),
      backgroundColor: this.getColor(i, 0.5),
      borderColor: this.getColor(i, 1),
      borderWidth: 1,
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
