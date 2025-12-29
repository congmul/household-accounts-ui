import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const coreServiceUrl = process.env.NEXT_PUBLIC_CORE_SERVICE_URL;

const client: AxiosInstance = axios.create({
    baseURL: coreServiceUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    // other defaults can be added here (timeout, withCredentials, etc.)
});

async function handleRequest<T>(promise: Promise<{ data: T }>): Promise<T | undefined> {
    try {
        const { data } = await promise;
        return data;
    } catch (err) {
        // Centralized logging; callers can decide how to handle undefined
        // In the future we can map errors to a consistent shape here
        // eslint-disable-next-line no-console
    console.error('HTTP request failed', err);
    // rethrow so service layer can handle errors consistently
    throw err;
    }
}

export const httpClient = {
    get: <TResponse>(url: string, config?: AxiosRequestConfig) => handleRequest<TResponse>(client.get(url, config)),
    post: <TResponse, TPayload>(url: string, payload: TPayload, config?: AxiosRequestConfig) => handleRequest<TResponse>(client.post(url, payload, config)),
    patch: <TResponse, TPayload>(url: string, payload?: TPayload, config?: AxiosRequestConfig) => handleRequest<TResponse>(client.patch(url, payload, config)),
    put: <TResponse, TPayload>(url: string, payload?: TPayload, config?: AxiosRequestConfig) => handleRequest<TResponse>(client.put(url, payload, config)),
    delete: <TResponse>(url: string, config?: AxiosRequestConfig) => handleRequest<TResponse>(client.delete(url, config)),
};

export default client;
