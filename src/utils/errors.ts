// src/utils/errors.ts

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

/**
 * Safely extracts error message from unknown error types
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'object' && error !== null) {
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }

        // Handle axios error structure
        if ('response' in error && typeof error.response === 'object' && error.response !== null) {
            const response = error.response as any;
            if (response.data?.message) {
                return response.data.message;
            }
        }
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred';
}


export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as ApiError).message === 'string'
    );
}
