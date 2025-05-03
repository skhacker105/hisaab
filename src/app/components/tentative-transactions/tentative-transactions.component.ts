import { Component } from '@angular/core';
import { LoggerService, SmsService, TransactionsService } from '../../services';
import { ITentativeTransaction, Transaction } from '../../interfaces';
import { Capacitor } from '@capacitor/core';
import { generateHexId } from '../../utils';

@Component({
  selector: 'app-tentative-transactions',
  templateUrl: './tentative-transactions.component.html',
  styleUrl: './tentative-transactions.component.scss'
})
export class TentativeTransactionsComponent {
  tentativeTransactions: ITentativeTransaction[] = [];

  selectedValues: {
    [id: string]: {
      amount?: number;
      description?: string;
      type?: 'credit' | 'debit';
    };
  } = {};

  isLoaderActive = false;

  constructor(private transactionService: TransactionsService, public sms: SmsService, private loggerService: LoggerService) { }

  ngOnInit(): void {
    this.loadTentative();
  }

  loadTentative() {
    if (Capacitor.getPlatform() !== 'web'){
      this.isLoaderActive = true;
      setTimeout(async () => {
        this.tentativeTransactions = await this.sms.readMessages();
        this.loggerService.log(this.tentativeTransactions.length);
        this.isLoaderActive = false;
      }, 100);
    }
    else
      this.tentativeTransactions = [
        {
          id: '1',
          date: new Date().toString(),
          body: 'Your a/c XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX1234 is credited with Rs. 5000 on 01-Jan-2025. Avl bal: Rs. 15000',
          possibleAmounts: [5000, 4999.99],
          possibleDescriptions: ['Salary', 'January Payment']
        },
        {
          id: '2',
          date: new Date().toString(),
          body: 'Rs. 1200 debited from your a/c XXXXX1234 on 03-Jan-2025 at Swiggy',
          possibleAmounts: [1200],
          possibleDescriptions: ['Food', 'Swiggy Order']
        },
        {
          id: '3',
          date: new Date().toString(),
          body: 'INR 8500 credited to your a/c on 05-Jan-2025. Ref: UPI12345XYZ',
          possibleAmounts: [8500],
          possibleDescriptions: ['UPI Transfer', 'Friend Payback']
        }
      ];
  }

  selectValue(id: string, key: 'amount' | 'description' | 'type', value: any) {
    if (!this.selectedValues[id]) {
      this.selectedValues[id] = {};
    }
    this.selectedValues[id][key] = value;
  }

  handleAmountInput(event: Event, id: string) {
    const value = +(event.target as HTMLInputElement).value;
    this.selectValue(id, 'amount', value);
  }

  handleDescriptionInput(event: Event, id: string) {
    const value = (event.target as HTMLInputElement).value;
    this.selectValue(id, 'description', value);
  }

  confirm(tentative: ITentativeTransaction) {
    const values = this.selectedValues[tentative.id] || {};
    if (!values.amount || !values.description || !values.type) {
      alert('Please complete amount, description, and type.');
      return;
    }

    const transaction: Transaction = {
      id: generateHexId(16),
      amount: values.type === 'debit' ? -Math.abs(values.amount) : Math.abs(values.amount),
      description: values.description,
      transactionType: values.type,
      date: tentative.date,
      source: 'phoneMessage',
      tentative
    };

    this.transactionService.confirmTentative(tentative.id, transaction);
    this.sms.addConfirmedMessageId(tentative.id);
    this.loadTentative();
  }

  delete(tentative: ITentativeTransaction) {
    this.sms.addDeletedMessageId(tentative.id);
    this.loadTentative();
  }
}
