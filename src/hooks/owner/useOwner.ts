// src/services/hooks/useOwner.ts
import { useMutation } from '@tanstack/react-query';
import { ensureOwner, setManualOpen, setOpeningHours } from '../../services/owner/ownerService.ts';
import type { OpeningHours, RestaurantDto } from '../../types';

export const useEnsureOwner = () =>
    useMutation({ mutationFn: ensureOwner });

export const useSetOpeningHours = () =>
    useMutation<RestaurantDto, unknown, OpeningHours[]>({ mutationFn: setOpeningHours });

export const useSetManualOpen = () =>
    useMutation<RestaurantDto, unknown, boolean>({ mutationFn: setManualOpen });
