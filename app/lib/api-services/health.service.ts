import { httpClient } from '@/app/lib/infrastructure/http/httpClient';
const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL;
const coreServiceUrl = process.env.NEXT_PUBLIC_CORE_SERVICE_URL;

export const healthService = {
    accountHealth: () => {
        // fire-and-forget; keep using full URL because userService is external to coreServiceUrl
        httpClient.get(`${userServiceUrl}/health`);
    },
    coreHealth: () => {
        httpClient.get(`${coreServiceUrl}/health`);
    }
}