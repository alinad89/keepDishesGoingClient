import { useMutation } from '@tanstack/react-query';
import { registerAdministrator } from '../api/administrators';
import type { RegisterAdministratorResponse } from '../types/api';

/**
 * Hook to register an administrator in the backend
 * The administrator information (ID, email, sub) is extracted from the JWT token
 */
export function useRegisterAdministrator() {
  const mutation = useMutation<RegisterAdministratorResponse, Error>({
    mutationFn: registerAdministrator,
  });

  return {
    registerAdministratorAsync: mutation.mutateAsync,
    registerAdministrator: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}
