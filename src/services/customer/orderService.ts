import axiosClient from "../../lib/axiosClient";
import type { CustomerOrderDto, UUID, CustomerOrderItemDto } from "../../types";

function toNumber(n: unknown): number {
    if (typeof n === "number") return n;
    if (typeof n === "string") return Number(n);
    return n as number;
}

function normalizeItems(items: any[]): CustomerOrderItemDto[] {
    return (items ?? []).map((it) => ({
        dishId: it.dishId,
        dishName: it.dishName,
        quantity: it.quantity,
        unitPrice: toNumber(it.unitPrice),
    }));
}

function normalizeOrder(raw: any): CustomerOrderDto {
    return {
        orderId: raw.orderId,
        restaurantId: raw.restaurantId,
        status: raw.status,
        submittedAt: raw.submittedAt,
        totalPrice: toNumber(raw.totalPrice),
        items: normalizeItems(raw.items),
        pickupAddress: raw.pickupAddress ?? null,
        dropoffAddress: raw.dropoffAddress ?? null,
        lat: raw.lat ?? null,
        lng: raw.lng ?? null,
    };
}

export async function fetchOrderById(orderId: UUID): Promise<CustomerOrderDto> {
    try {
        console.log(`[orderService] Fetching order ${orderId}`);
        const { data } = await axiosClient.get(`/orders/${orderId}`);
        console.log(`[orderService] Order ${orderId} fetched:`, data);
        return normalizeOrder(data);
    } catch (error: any) {
        console.error(`[orderService] Failed to fetch order ${orderId}:`, error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}

export async function fetchCustomerOrders(): Promise<CustomerOrderDto[]> {
    try {
        console.log("[orderService] Fetching customer orders");
        const { data } = await axiosClient.get("/orders/my");
        console.log("[orderService] Customer orders fetched:", data);
        const orders = (Array.isArray(data) ? data : []).map(normalizeOrder);
        console.log("[orderService] Normalized orders:", orders);
        return orders;
    } catch (error: any) {
        console.error("[orderService] Failed to fetch customer orders:", error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}
