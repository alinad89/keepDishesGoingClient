// src/services/ownerService.ts
import axiosClient from '../../lib/axiosClient.ts';
import type { OpeningHours, RestaurantDto } from '../../types/index.ts';

export async function ensureOwner() {
    const { data } = await axiosClient.post<{ ownerId: string; email: string; created: boolean }>(
        '/owners/me/ensure'
    );
    return data;
}

export async function setOpeningHours(openingHours: OpeningHours[]) {
    const { data } = await axiosClient.put<RestaurantDto>(
        '/owners/me/restaurant/opening-hours',
        openingHours
    );
    return data;
}

export async function setManualOpen(manuallyOpen: boolean) {
    const { data } = await axiosClient.patch<RestaurantDto>(
        '/owners/me/restaurant',
        { manuallyOpen }
    );
    return data;
}
