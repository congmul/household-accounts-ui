import { AccountBookWithMember, AccountBookPayload } from '@/app/lib/models';
import { httpClient } from '../infrastructure/http/httpClient';

export const accountBookService = {
    create: async (payload: AccountBookPayload):Promise<AccountBookWithMember | undefined> => {
        try {
            const data = await httpClient.post<AccountBookWithMember, AccountBookPayload>(`/account-book`, payload);
            return data;
        } catch (err) {
            console.log(err);
            return undefined;
        }
    },
    getByUserId: async (userId: string):Promise<AccountBookWithMember[] | undefined> => {
        try {
            const data = await httpClient.get<AccountBookWithMember[]>(`/account-book/${userId}`);
            return data || [];
        } catch (err) {
            console.log(err);
            return [];
        }
    },
    setDefaultAccountBook: async (accountBookId: string, userId: string):Promise<AccountBookWithMember | undefined> => {
        try {
            const data = await httpClient.patch<AccountBookWithMember, undefined>(`/account-book/set-default/${userId}/${accountBookId}`);
            return data;
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }
};