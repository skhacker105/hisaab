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
    },
    {
        id: '4',
        date: new Date('2025-01-30').toString(),
        body: 'Your a/c XXXXX1234 is debited with Rs. 2500 on 06-Jan-2025 towards Amazon',
        possibleAmounts: [2500],
        possibleDescriptions: ['Shopping', 'Amazon Purchase']
    },
    {
        id: '5',
        date: new Date().toString(),
        body: 'Rs. 10000 credited in your a/c XXXXX1234 via NEFT on 07-Jan-2025. Avl bal: Rs. 22500',
        possibleAmounts: [10000],
        possibleDescriptions: ['NEFT Transfer', 'Freelance Payment']
    },
    {
        id: '6',
        date: new Date().toString(),
        body: 'Rs. 450 debited from a/c XXXXX1234 on 08-Jan-2025 for Netflix subscription',
        possibleAmounts: [450],
        possibleDescriptions: ['Entertainment', 'Netflix Subscription']
    },
    {
        id: '7',
        date: new Date().toString(),
        body: 'INR 3000 debited from your a/c XXXXX1234 via UPI at Zomato on 09-Jan-2025',
        possibleAmounts: [3000],
        possibleDescriptions: ['Dining', 'Zomato Order']
    },
    {
        id: '8',
        date: new Date('2025/02/05').toString(),
        body: 'Your account XXXXX1234 is credited with Rs. 2000 on 10-Jan-2025. Description: Cashback Offer',
        possibleAmounts: [2000],
        possibleDescriptions: ['Cashback', 'Promotional Credit']
    },
    {
        id: '9',
        date: new Date().toString(),
        body: 'Rs. 780 debited from your a/c XXXXX1234 at Petrol Pump on 11-Jan-2025',
        possibleAmounts: [780],
        possibleDescriptions: ['Fuel', 'Petrol Expense']
    },
    {
        id: '10',
        date: new Date().toString(),
        body: 'INR 6000 credited to your a/c XXXXX1234 via IMPS on 12-Jan-2025. Ref: IMPS456XYZ',
        possibleAmounts: [6000],
        possibleDescriptions: ['IMPS Transfer', 'Loan Repayment']
    }
];