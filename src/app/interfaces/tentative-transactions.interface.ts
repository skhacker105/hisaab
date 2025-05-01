export interface ITentativeTransaction {
    id: string | number;
    receivedAt: string;
    body: string;
    possibleAmounts: number[];
    possibleDescriptions: string[];
}