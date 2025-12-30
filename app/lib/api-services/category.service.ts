import { Category, CategoryPayload, SubcategoryPayload } from '@/app/lib/models';
import { httpClient } from '@/app/lib/infrastructure/http/httpClient';

export const categoryService = {
    getByUserId: async (userId: string, accountBookId:string, type: string):Promise<Category[] | undefined> => {
      try{
        const data = await httpClient.get<Category[]>(`/category/${userId}/${accountBookId}/user?type=${type}`);
        return data;
      }catch(err){

      }
    },
    create: async (userId: string, payload: CategoryPayload) => {
      try{
        const data = await httpClient.post<any, any>(`/category`, {...payload, userId});
        return data;
      }catch(err){
        throw err;
      }
    },
    createSubCategory: async (categoryId: string, payload: CategoryPayload) => {
      try{
        const data = await httpClient.post<any, CategoryPayload>(`/category/${categoryId}/subcategory`, {...payload});
        return data;
      }catch(err){
        throw err;
      }
    },
    deleteCategory: async (categoryId: string) => {
      try{
        // const { data } = await axios.delete(`${coreServiceUrl}/${categoryId}`);
        // return data;
      }catch(err){
        throw err;
      }
    }
}