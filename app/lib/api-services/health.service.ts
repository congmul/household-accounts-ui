import axios from 'axios';
const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL;
const coreServiceUrl = process.env.NEXT_PUBLIC_CORE_SERVICE_URL;

export const healthService = {
    accountHealth: () => {
        axios.get(`${userServiceUrl}/health`);
    },
    coreHealth: () => {
        axios.get(`${coreServiceUrl}/health`);
    }
}