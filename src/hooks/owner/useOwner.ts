// src/hooks/owner/useOwner.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { ensureOwner, setManualOpen, setOpeningHours } from '../../services/owner/ownerService.ts';
import { createRestaurant, getMyRestaurant } from '../../services/owner/restaurantApi.ts';
import type { OpeningHours, RestaurantDto } from '../../types';

export const useEnsureOwner = () =>
    useMutation({ mutationFn: ensureOwner });

export const useMyRestaurant = () =>
    useQuery<RestaurantDto | null>({
        queryKey: ['restaurant', 'me'],
        queryFn: getMyRestaurant,
        retry: false,
    });

export const useCreateRestaurant = () =>
    useMutation<RestaurantDto, unknown, FormData>({
        mutationFn: createRestaurant,
    });

export const useSetOpeningHours = () =>
    useMutation<void, unknown, OpeningHours>({ mutationFn: setOpeningHours });

export const useSetManualOpen = () =>
    useMutation<void, unknown, boolean>({ mutationFn: setManualOpen });
