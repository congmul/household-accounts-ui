import { User, LoginResponse, LoginPayload, } from '@/app/lib/models';
import { httpClient } from '@/app/lib/infrastructure/http/httpClient';
const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL;
export const userService = {
    login: async (payload: LoginPayload):Promise<LoginResponse> => {
        try{
            const data = await httpClient.post<LoginResponse, LoginPayload>(`${userServiceUrl}/auth/login`, payload);
            if(!data) throw new Error('Login failed');
            return data;
        }catch(err){
          throw err;
        }
    },
    msLogin: async () => {
        try{
            const data = await httpClient.get<any>(`${userServiceUrl}/auth/login/ms`);
            return data;
        }catch(err){
            throw err;
        }
    },
    googleLogin: async () => {
        try{
            const data = await httpClient.get<any>(`${userServiceUrl}/auth/login/google`);
            return data;
        }catch(err){
            throw err;
        }
    }
}