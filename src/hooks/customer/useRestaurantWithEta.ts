import { useQuery } from "@tanstack/react-query";
import { fetchRestaurantDetails, fetchRestaurantEta } from "../../services/customer/restaurantService";
import { useGeolocation } from "./useGeolocation";
import type { RestaurantWithEta } from "../../types";

export function useRestaurantWithEta(restaurantId: string | undefined) {
    const { coordinates, isLoading: isLoadingLocation, error: locationError } = useGeolocation();

    console.log('[useRestaurantWithEta] coordinates:', coordinates);
    console.log('[useRestaurantWithEta] restaurantId:', restaurantId);

    // Fetch restaurant details
    const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
        queryKey: ["restaurant-details", restaurantId],
        queryFn: () => fetchRestaurantDetails(restaurantId!),
        enabled: !!restaurantId,
    });

    // Fetch ETA
    const { data: etaMinutes, isLoading: isLoadingEta, isError, error } = useQuery({
        queryKey: ["restaurant-eta", restaurantId, coordinates],
        queryFn: () => {
            console.log('[useRestaurantWithEta] Fetching ETA with coords:', coordinates);
            return fetchRestaurantEta(restaurantId!, coordinates!);
        },
        enabled: !!restaurantId && !!coordinates,
    });

    // Combine into RestaurantWithEta
    const restaurantWithEta: RestaurantWithEta | undefined =
        restaurant && etaMinutes !== undefined
            ? { restaurant, etaMinutes: etaMinutes }
            : undefined;

    return {
        restaurantWithEta,
        isLoading: isLoadingLocation || isLoadingRestaurant || isLoadingEta,
        isError: isError || !!locationError,
        error: error || locationError,
        coordinates,
    };
}
