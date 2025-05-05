import { MessageObject } from "@solimanware/capacitor-message-reader";

export const tempTentativeTransaction: { messages: MessageObject[] } = {
    messages: [
        {
            id: '1',
            date: new Date().getTime(),
            messageType: 'sms',
            sender: '',
            body: 'Your a/c XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX1234 is credited with Rs. 5000 on 01-Jan-2025. Avl bal: Rs. 15000',
        },
        {
            id: '2',
            date: new Date().getTime(),
            messageType: 'sms',
            sender: '',
            body: 'Rs. 1200 debited from your a/c XXXXX1234 on 03-Jan-2025 at Swiggy',
        },
        {
            id: '3',
            date: new Date().getTime(),
            messageType: 'sms',
            sender: '',
            body: 'INR 8500 credited to your a/c on 05-Jan-2025. Ref: UPI12345XYZ',
        },
        {
            id: '4',
            date: new Date('2025-01-30').getTime(),
            messageType: 'sms',
            sender: '',
            body: 'Your a/c XXXXX1234 is debited with Rs. 2500 on 06-Jan-2025 towards Amazon',
        },
        {
            id: '5',
            date: new Date().getTime(),
            messageType: 'sms',
            sender: '',
            body: 'Rs. 10000 credited in your a/c XXXXX1234 via NEFT on 07-Jan-2025. Avl bal: Rs. 22500',
        },
        {
            id: '6',
            date: new Date().getTime(),
            messageType: 'sms',
            sender: '',
            body: 'Rs. 450 debited from a/c XXXXX1234 on 08-Jan-2025 for Netflix subscription',
        },
        {
            id: '7',
            date: new Date().getTime(),
            messageType: 'sms',
            sender: '',
            body: 'INR 3000 debited from your a/c XXXXX1234 via UPI at Zomato on 09-Jan-2025',
        },
        {
            id: '8',
            date: new Date('2025/02/05').getTime(),
            messageType: 'sms',
            sender: '',
            body: 'Your account XXXXX1234 is credited with Rs. 2000 on 10-Jan-2025. Description: Cashback Offer',
        },
        {
            id: '9',
            date: new Date().getTime(),
            messageType: 'sms',
            sender: '',
            body: 'Rs. 780 debited from your a/c XXXXX1234 at Petrol Pump on 11-Jan-2025',
        },
        {
            id: '10',
            date: new Date().getTime(),
            messageType: 'sms',
            sender: '',
            body: 'INR 6000 credited to your a/c XXXXX1234 via IMPS on 12-Jan-2025. Ref: IMPS456XYZ',
        },
        {
            id: '11',
            date: new Date().getTime(),
            messageType: 'sms',
            sender: '',
            body: 'Dear Customer, Rs.25,588.00 is credited to your IDBI Bank Loan a/c NNNNNNNNNNN98272 on 10 APR 25. Regards IDBI Bank',
        },
    ]
};