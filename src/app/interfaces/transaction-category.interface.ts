export interface ITransactionCategory {
    category: string;
    divisions: string[];
    matIcon: string;
}

export interface ITransactionCategoryCrudEnabled {
    category: string;
    staticDivisions: string[];
    matIcon: string;
    dynamicDivisions: string[];
}