// src/hooks/kdg/usePriceSnapshots.ts
import { useQuery } from "@tanstack/react-query";
import { getPriceSnapshots } from "../../services/kdg/priceSnapshotsService";
import type { UUID } from "../../types";

export function usePriceSnapshots(restaurantId: UUID | null) {
    return useQuery({
        queryKey: ["priceSnapshots", restaurantId],
        queryFn: () => getPriceSnapshots(restaurantId!),
        enabled: !!restaurantId,
    });
}
