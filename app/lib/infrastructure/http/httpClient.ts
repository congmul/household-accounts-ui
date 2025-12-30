import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiError } from './apiError';

const coreServiceUrl = process.env.NEXT_PUBLIC_CORE_SERVICE_URL;

const client: AxiosInstance = axios.create({
    baseURL: coreServiceUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    // other defaults can be added here (timeout, withCredentials, etc.)
});

async function handleRequest<T>(promise: Promise<{ data: T }>): Promise<T> {
    try {
        const { data } = await promise;
        if(!data) throw new ApiError('No data received from server', 'NO_DATA');

        return data;
    } catch (err: any) {
        if (err instanceof ApiError) {
            // Handle known API errors
            throw err;
        } else {
            const error: AxiosError = err;
            if(error.status === 404){
                throw new ApiError('Resource not found', 'NOT_FOUND', error.status, error);
            }
            if(error.status === 401){
                throw new ApiError('Unauthorized access', 'UNAUTHORIZED', error.status, error);
            }
            if(error.status === 400){
                throw new ApiError(error.message, 'INVALID_REQUEST', error.status, error);
            }
            // Handle unexpected errors
            throw new ApiError('Unexpected error occurred', 'SERVER_ERROR', error.status, error);
        }
    }
}

export const httpClient = {
    get: <TResponse>(url: string, config?: AxiosRequestConfig) => handleRequest<TResponse>(client.get(url, config)),
    post: <TResponse, TPayload>(url: string, payload: TPayload | undefined, config?: AxiosRequestConfig) => handleRequest<TResponse>(client.post(url, payload, config)),
    patch: <TResponse, TPayload>(url: string, payload?: TPayload | undefined, config?: AxiosRequestConfig) => handleRequest<TResponse>(client.patch(url, payload, config)),
    put: <TResponse, TPayload>(url: string, payload?: TPayload | undefined, config?: AxiosRequestConfig) => handleRequest<TResponse>(client.put(url, payload, config)),
    delete: <TResponse>(url: string, config?: AxiosRequestConfig) => handleRequest<TResponse>(client.delete(url, config)),
};

export default client;
