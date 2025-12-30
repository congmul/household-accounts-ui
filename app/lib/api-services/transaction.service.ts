import { Transaction, AddTransactionPayload, PatchTransactionPayload, TransactionItems } from '@/app/lib/models';
import { httpClient } from '@/app/lib/infrastructure/http/httpClient';
const coreServiceUrl = process.env.NEXT_PUBLIC_CORE_SERVICE_URL;
export const transactionService = {
  /**
   * 
   * @param userId mongoDB ObjectId
   * @param accountBookId mongoDB ObjectId
   * @param expenseMonth string 2024-07
   * @returns 
   */
    getExpenseByUserId: async (userId: string, accountBookId: string, year: string, month: string, groupBy?: string):Promise<Transaction[] | undefined> => {
        try{
          const data = await httpClient.get<Transaction[]>(`${coreServiceUrl}/transaction/${userId}/${accountBookId}/user?type=expense&year=${year}&month=${month}&groupBy=${groupBy}`);
          return data;
        }catch(err){
          throw err;
        }
    },
    getInvestmentsByUserId: async (userId: string, accountBookId: string, year: string, month: string, groupBy?: string):Promise<Transaction[] | TransactionItems[] | undefined> => {
        try{
            const data = await httpClient.get<Transaction[] | TransactionItems[]>(`${coreServiceUrl}/transaction/${userId}/${accountBookId}/user?type=investment&year=${year}&month=${month}&groupBy=${groupBy}`);
            return data;
        }catch(err){
          throw err;
        }
    },
    getIncomeByUserId: async (userId: string, accountBookId: string, year: string, month: string, groupBy?: string):Promise<Transaction[] | TransactionItems[] | undefined> => {
        try{
            const data = await httpClient.get<Transaction[] | TransactionItems[]>(`${coreServiceUrl}/transaction/${userId}/${accountBookId}/user?type=income&year=${year}&month=${month}&groupBy=${groupBy}`);
            return data;
        }catch(err){
          throw err;
        }
    },
    createTransaction: async (payload: AddTransactionPayload) => {
      try{
        const data = await httpClient.post<any, AddTransactionPayload>(`${coreServiceUrl}/transaction`, payload);
        return data;
      }catch(err){
        throw err;
      }
    },
    updateTransaction: async (transactionId: string, payload: PatchTransactionPayload) => {
      try{
        const data = await httpClient.patch<any, PatchTransactionPayload>(`${coreServiceUrl}/transaction/${transactionId}`, payload);
        return data;
      }catch(err){
        throw err;
      }
    },
    deleteTransaction: async (transactionId: string) => {
      try{
        const data = await httpClient.delete<any>(`${coreServiceUrl}/transaction/${transactionId}`);
        return data;
      }catch(err){
        throw err;
      }
    },
    deleteFixedExpense: async (transactionId: string, fixedSeriesId: string, action = 'only_one') => {
      try{
        const data = await httpClient.delete<any>(`${coreServiceUrl}/transaction/fixedExpense/${transactionId}/${fixedSeriesId}?action=${action}`);
        return data;
      }catch(err){
        throw err;
      }
    }
}