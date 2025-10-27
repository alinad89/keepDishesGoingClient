// src/services/restaurantApi.ts
import axiosClient from '../../lib/axiosClient.ts';
import type { OpeningHours, RestaurantDto } from '../../types';

export function buildRestaurantFormData(payload: {
    name: string;
    email: string;
    cuisineType: string;
    prepTime: number;
    address: { street: string; postalCode?: string; city: string; country: string };
    openingHours: OpeningHours;
    pictureUrls: string[]; // if you add file input later, append 'pictures'
}) {
    const fd = new FormData();
    fd.append('name', payload.name);
    fd.append('email', payload.email);
    fd.append('prepTime', String(payload.prepTime));
    fd.append('address.street', payload.address.street);
    if (payload.address.postalCode) fd.append('address.postalCode', payload.address.postalCode);
    fd.append('address.city', payload.address.city);
    fd.append('address.country', payload.address.country);
    fd.append('cuisineType', payload.cuisineType);

    payload.openingHours.forEach((oh, i) => {
        fd.append(`openingHours[${i}].day`, oh.day);
        fd.append(`openingHours[${i}].open`, oh.open);
        fd.append(`openingHours[${i}].close`, oh.close);
    });

    payload.pictureUrls.forEach((u) => fd.append('pictureUrls', u));
    return fd;
}
export async function createRestaurant(fd: FormData): Promise<RestaurantDto> {
    const { data } = await axiosClient.post<RestaurantDto>('/restaurants', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }, // ✅ ensure boundary is set by the browser
    });
    return data;
}

export async function getMyRestaurant(): Promise<RestaurantDto | null> {
    const res = await axiosClient.get('/restaurants/me', { validateStatus: () => true });
    if (res.status === 204 || res.status === 404) return null; // ✅ handle both
    return res.data as RestaurantDto;
}

export async function getRestaurantById(id: string): Promise<RestaurantDto> {
    const { data } = await axiosClient.get<RestaurantDto>(`/restaurants/${id}`);
    return data;
}
