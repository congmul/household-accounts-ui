import { Budget, BudgetPayload } from '@/app/lib/models';
import { httpClient } from '@/app/lib/infrastructure/http/httpClient';

export const budgetService = {
    getByUserId: async (userId: string, accountBookId: string, year: string, month: string):Promise<Budget | undefined> => {
        try{
            const data = await httpClient.get<Budget[]>(`/budget/${userId}/${accountBookId}/user?year=${year}&month=${month}`);
            return (data && data[0]) || undefined;
        }catch(err){
            console.log(err);
        }
    },
    createBudget: async (payload: BudgetPayload):Promise<Budget | undefined> => {
        try{
            const data = await httpClient.post<Budget, BudgetPayload>(`/budget`, payload);
            return data;
        }catch(err){
            console.log(err);
        }
    },
    createCopyAllPreMonth: async (userId: string, accountBookId: string):Promise<void> => {
        try{
            await httpClient.post(`/budget/copy-all-pre-month`, { userId, accountBookId });
        }catch(err){
            console.log(err);
        }
    },
    updateBudget: async (budgetId:string, amount: number):Promise<Budget | undefined> => {
        try{
            const data = await httpClient.patch<Budget, {amount: number}>(`/budget/${budgetId}`, {amount});
            return data;
        }catch(err){
            console.log(err);
        }
    }
}