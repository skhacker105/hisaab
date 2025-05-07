export interface ITransactionCategoryCrudEnabled {
    category: string;
    staticDivisions: string[];
    matIcon: string;
    dynamicDivisions: string[];
}

export interface IFavoriteDivision {
    category: string;
    division: string;
    addedOn: string;
    updatedOn?: string;
    usedCounts: number;
}