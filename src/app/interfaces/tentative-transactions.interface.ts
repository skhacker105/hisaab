export interface ITentativeTransaction {
    id: string;
    date: string;
    body: string;
    possibleAmounts: number[];
    possibleDescriptions: string[];
}