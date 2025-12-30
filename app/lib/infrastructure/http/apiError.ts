export type ApiErrorCode = 'NO_DATA' | 'INVALID_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'SERVER_ERROR';

export class ApiError extends Error {
    constructor(
        message: string,
        public code: ApiErrorCode,
        public status?: number,
        public body?: unknown,
    ) {
        super(message);
    }
}