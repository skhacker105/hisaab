export interface Transaction {
    id: string;
    amount: number;
    description: string;
    transactionType: 'credit' | 'debit';
    date: Date;
    sourceMessageId?: string;
    isTentative?: boolean;
    messageDetails?: {
        sender: string;
        body: string;
        receivedAt: Date;
    };
}
