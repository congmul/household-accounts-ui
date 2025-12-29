export type BudgetItem = {
    _id: string;
    amount: number;
    category: string;
    date: string;
}
export type Budget = {
    _id: string;    
    totalAmount: number;
    budgets: BudgetItem[];
}
export type BudgetPayload = {
    userId:string;
    date:string;
    amount: number;
    category:string;
}