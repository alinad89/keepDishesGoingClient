import { useQuery } from "@tanstack/react-query";
import { fetchRestaurantsWithEta, type CustomerRestaurantFilters } from "../../services/customer/restaurantService";
import { useGeolocation } from "./useGeolocation";

export function useRestaurantsWithEta(filters: CustomerRestaurantFilters = {}) {
    const { coordinates, isLoading: isLoadingLocation, error: locationError } = useGeolocation();

    const { data, isLoading: isLoadingRestaurants, isError, error } = useQuery({
        queryKey: ["restaurants-with-eta", coordinates, filters],
        queryFn: () => fetchRestaurantsWithEta(coordinates!, filters),
        enabled: !!coordinates,
        staleTime: 60_000,
    });

    return {
        restaurantsWithEta: data || [],
        isLoading: isLoadingLocation || isLoadingRestaurants,
        isError: isError || !!locationError,
        error: error || locationError,
        coordinates,
        hasLocation: !!coordinates,
    };
}
