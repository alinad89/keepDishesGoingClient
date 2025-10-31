// src/services/customer/restaurantService.ts
import axiosClient from '../../lib/axiosClient';
import type { RestaurantWithEta, RestaurantDto, Coordinates, CuisineType, PriceRange } from '../../types';

export type CustomerRestaurantFilters = {
    cuisineType?: CuisineType;
    priceRange?: PriceRange;
    distance?: number;
    maxPrepTime?: number;
};

export async function fetchCustomerRestaurants(filters: CustomerRestaurantFilters = {}) {
    const { data } = await axiosClient.get('/orders/restaurants', { params: filters });
    return Array.isArray(data) ? data : [];
}

export async function fetchRestaurantDetails(restaurantId: string): Promise<RestaurantDto> {
    const { data } = await axiosClient.get<RestaurantDto>(`/orders/restaurants/${restaurantId}`);
    return data;
}

export async function fetchRestaurantEta(
    restaurantId: string,
    customerCoordinates: Coordinates
): Promise<number> {
    const { data } = await axiosClient.get<number>(
        `/orders/restaurants/${restaurantId}/eta`,
        {
            params: {
                lat: customerCoordinates.lat,
                lng: customerCoordinates.lng,
            },
        }
    );
    console.log('[fetchRestaurantEta] Response:', data);
    return data;
}

export async function fetchRestaurantsWithEta(
    customerCoordinates: Coordinates,
    filters: CustomerRestaurantFilters = {}
): Promise<RestaurantWithEta[]> {
    const { data } = await axiosClient.get<RestaurantWithEta[]>(
        '/orders/restaurants/search-with-eta',
        {
            params: {
                lat: customerCoordinates.lat,
                lng: customerCoordinates.lng,
                ...filters,
            },
        }
    );
    console.log('[fetchRestaurantsWithEta] Response:', data);
    if (data && Array.isArray(data) && data.length > 0) {
        console.log('[fetchRestaurantsWithEta] First item:', data[0]);
    }
    return Array.isArray(data) ? data : [];
}
