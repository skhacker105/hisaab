import { Transaction } from "../interfaces";

export function generateHexId(length = 16): string {
    let result = '';
    const characters = '0123456789abcdef';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export function sortTransactionsByDateDesc(transactions: Transaction[]): Transaction[] {
    return transactions.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }