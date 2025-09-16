import axios from 'axios';
import { AccountBookWithMember } from '@/app/lib/models';
const coreServiceUrl = process.env.NEXT_PUBLIC_CORE_SERVICE_URL;

export const accountBookService = {
    create: async (payload: {userId:string, name:string, description?:string}):Promise<AccountBookWithMember | undefined> => {
        try{
            const { data } = await axios.post(`${coreServiceUrl}/account-book`, payload);            
            return data;            
        }catch(err){
            console.log(err);
        }
    },
    getByUserId: async (userId: string):Promise<AccountBookWithMember[] | undefined> => {
        try{
            const { data } = await axios.get(`${coreServiceUrl}/account-book/${userId}`);            
            return data || [];            
        }catch(err){
            console.log(err);
        }
    },
}