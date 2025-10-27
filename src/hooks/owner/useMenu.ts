// src/services/hooks/useMenu.ts
import { useMutation } from '@tanstack/react-query';
import { applyAllDrafts } from '../../services/owner/menuApi.ts';
import type { DishDto } from '../../types';

export const useApplyAllDrafts = () =>
    useMutation<DishDto[]>({ mutationFn: applyAllDrafts });
