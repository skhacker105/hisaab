export interface ITentativeTransaction {
    id: string | number;
    date: string;
    body: string;
    possibleAmounts: number[];
    possibleDescriptions: string[];
}