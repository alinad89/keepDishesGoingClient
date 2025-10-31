import { useQuery } from "@tanstack/react-query";
import { fetchCustomerOrders, fetchOrderById } from "../../services/customer/orderService";
import type { CustomerOrderDto, UUID } from "../../types";

export function useCustomerOrders() {
    return useQuery<CustomerOrderDto[]>({
        queryKey: ["customer", "orders", "list"],
        queryFn: () => fetchCustomerOrders(),
        refetchInterval: 15000,
        staleTime: 10000, // Consider data fresh for 10 seconds
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
        retry: 2, // Retry failed requests twice
        refetchOnWindowFocus: true, // Refetch when user returns to tab
        refetchOnMount: true, // Always refetch when component mounts
    });
}

export function useOrderTracking(orderId: UUID) {
    return useQuery<CustomerOrderDto>({
        queryKey: ["customer", "orders", orderId],
        queryFn: () => fetchOrderById(orderId),
        enabled: !!orderId,
        refetchInterval: 5000, // Refresh every 5 seconds for real-time location updates
        staleTime: 3000, // Consider data fresh for 3 seconds (shorter for real-time tracking)
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
        retry: 2, // Retry failed requests twice
        refetchOnWindowFocus: true, // Refetch when user returns to tab
        refetchOnMount: true, // Always refetch when component mounts
    });
}
