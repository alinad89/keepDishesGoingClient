// src/hooks/kdg/usePriceBands.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPriceBands, updatePriceBands } from "../../services/kdg/priceBandsService";
import type { PriceBands } from "../../types";

export function usePriceBands() {
    return useQuery({
        queryKey: ["priceBands"],
        queryFn: getPriceBands,
    });
}

export function useUpdatePriceBands() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bands: PriceBands) => updatePriceBands(bands),
        onSuccess: (responseData, variables) => {
            // Update cache with the new values we just sent
            queryClient.setQueryData(["priceBands"], variables);
            // Invalidate ALL price snapshot queries (matches all restaurantIds)
            queryClient.invalidateQueries({
                queryKey: ["priceSnapshots"],
                refetchType: 'all'
            });
        },
    });
}
