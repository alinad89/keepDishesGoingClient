// src/services/customer/restaurantService.ts
import axiosClient from '../../lib/axiosClient';

export type CustomerRestaurantFilters = {
    // add fields if you use them (e.g. cuisine, city)
};

export async function fetchCustomerRestaurants(filters: CustomerRestaurantFilters = {}) {
    const { data } = await axiosClient.get('/orders/restaurants', { params: filters });
    return Array.isArray(data) ? data : [];
}
