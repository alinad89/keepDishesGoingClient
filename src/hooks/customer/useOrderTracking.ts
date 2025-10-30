import { useQuery } from "@tanstack/react-query";
import { fetchCustomerOrders, fetchOrderById } from "../../services/customer/orderService";
import type { CustomerOrderDto, UUID } from "../../types";

export function useCustomerOrders() {
    return useQuery<CustomerOrderDto[]>({
        queryKey: ["customer", "orders", "list"],
        queryFn: () => fetchCustomerOrders(),
        refetchInterval: 15000,
    });
}

export function useOrderTracking(orderId: UUID) {
    return useQuery<CustomerOrderDto>({
        queryKey: ["customer", "orders", orderId],
        queryFn: () => fetchOrderById(orderId),
        enabled: !!orderId,
        refetchInterval: 5000, // Refresh every 5 seconds for real-time location updates
    });
}
