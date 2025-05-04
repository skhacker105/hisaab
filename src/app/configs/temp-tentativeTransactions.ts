import { ITentativeTransaction } from "../interfaces";

export const tempTentativeTransaction: ITentativeTransaction[] = [
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