import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchPendingOrders,
    fetchAcceptedOrders,
    acceptOrder,
    declineOrder,
    markOrderReadyForPickup,
} from "../../services/owner/orderService";
import type { UUID, IncomingOrderResponse } from "../../types";

export function usePendingOrders(restaurantId: UUID | undefined) {
    return useQuery<IncomingOrderResponse[]>({
        queryKey: ["owner", "orders", "pending", restaurantId],
        queryFn: () => fetchPendingOrders(),
        refetchInterval: 15000,
        enabled: !!restaurantId, // keep polling gated on known restaurant
    });
}

export function useAcceptedOrders(restaurantId: UUID | undefined) {
    return useQuery<IncomingOrderResponse[]>({
        queryKey: ["owner", "orders", "accepted", restaurantId],
        queryFn: () => fetchAcceptedOrders(),
        refetchInterval: 15000,
        enabled: !!restaurantId,
    });
}

export function useAcceptOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ restaurantId, orderId }: { restaurantId: UUID; orderId: UUID }) =>
            acceptOrder(restaurantId, orderId),
        onSuccess: (_, variables) => {
            // Invalidate both pending and accepted orders
            queryClient.invalidateQueries({ queryKey: ["owner", "orders", "pending", variables.restaurantId] });
            queryClient.invalidateQueries({ queryKey: ["owner", "orders", "accepted", variables.restaurantId] });
        },
    });
}

export function useDeclineOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ restaurantId, orderId, reason }: { restaurantId: UUID; orderId: UUID; reason?: string }) =>
            declineOrder(restaurantId, orderId, reason),
        onSuccess: async () => {
            // Invalidate all order queries
            await queryClient.invalidateQueries({ queryKey: ["owner", "orders"] });
        },
    });
}

export function useMarkOrderReady() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ restaurantId, orderId }: { restaurantId: UUID; orderId: UUID }) =>
            markOrderReadyForPickup(restaurantId, orderId),
        onSuccess: (_, variables) => {
            // Invalidate both accepted orders and all orders queries
            queryClient.invalidateQueries({ queryKey: ["owner", "orders", "accepted", variables.restaurantId] });
            queryClient.invalidateQueries({ queryKey: ["owner", "orders"] });
        },
    });
}
