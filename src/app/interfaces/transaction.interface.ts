import { ITentativeTransaction } from "./";

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    transactionType: 'credit' | 'debit';
    date: string;
    sourceMessageId?: string;
    isTentative?: boolean;
    source: 'manual' | 'phoneMessage';
    tentative?: ITentativeTransaction

}
