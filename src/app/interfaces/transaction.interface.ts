import { ITentativeTransaction } from "./";

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    transactionType: 'credit' | 'debit';
    category?: string;
    date: string;
    sourceMessageId?: string;
    source: 'manual' | 'phoneMessage';
    tentative?: ITentativeTransaction

}
