// src/hooks/customer/useCustomerDishes.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCustomerDishes, type CustomerDishFilters } from '../../services/customer/customerDishes';
import type { DishDto } from '../../types';

export default function useCustomerDishes(
    restaurantId: string,
    filters: CustomerDishFilters = {}
) {
    return useQuery<DishDto[]>({
        queryKey: ['customer-dishes', restaurantId, filters],
        queryFn:  () => {
            return fetchCustomerDishes(restaurantId, filters);
        },
    });
}
