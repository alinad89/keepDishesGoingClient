import { useMutation } from '@tanstack/react-query';
import { registerDeveloper } from '../api/developers';
import type { RegisterDeveloperResponse } from '../types/developer.types';
import { ApiError } from '../api/config';

/**
 * Hook to register a developer
 * POST /api/developers
 */
export function useRegisterDeveloper() {
  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<RegisterDeveloperResponse, Error>({
    mutationFn: registerDeveloper,
  });

  return {
    registerDeveloper: mutate,
    registerDeveloperAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}
