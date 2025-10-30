// src/services/ownerService.ts
import axiosClient from '../../lib/axiosClient.ts';
import type { OpeningHours, RestaurantDto } from '../../types/index.ts';

export async function ensureOwner() {
    const { data } = await axiosClient.post<{ ownerId: string; email: string; created: boolean }>(
        '/owners/me/ensure'
    );
    return data;
}

export async function setOpeningHours(openingHours: OpeningHours) {
    // Convert to backend format
    const schedule = openingHours.map(h => ({
        dayOfWeek: h.day,
        openTime: h.open,
        closeTime: h.close
    }));

    await axiosClient.put<void>(
        '/owners/me/restaurant/opening-hours',
        { schedule }
    );
}

export async function setManualOpen(manuallyOpen: boolean) {
    // Backend expects { closed: boolean }, so we invert the logic
    await axiosClient.patch<void>(
        '/owners/me/restaurant/manual-schedule',
        { closed: !manuallyOpen }
    );
}
