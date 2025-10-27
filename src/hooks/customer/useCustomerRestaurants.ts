import { useQuery } from "@tanstack/react-query";
import {
    fetchCustomerRestaurants,
    type CustomerRestaurantFilters,
} from "../../services/customer/restaurantService.ts";

export function useCustomerRestaurants(filters: CustomerRestaurantFilters = {}) {
    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ["customer-restaurants", filters],
        queryFn: () => fetchCustomerRestaurants(filters),
    });

    return {
        restaurants: (data ?? []) as any[], // type to your RestaurantDto if you have it
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    };
}
