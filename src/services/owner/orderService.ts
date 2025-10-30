import axiosClient from "../../lib/axiosClient";
import type { UUID, OrderStatusChangeRequest, IncomingOrderResponse } from "../../types";
import { extractDishId } from "../../types";

// Normalize backend response to ensure dishId is a string
function normalizeIncomingOrder(raw: any): IncomingOrderResponse {
    return {
        ...raw,
        orderItems: (raw.orderItems || []).map((item: any) => ({
            dishId: extractDishId(item.dishId),
            quantity: item.quantity,
        })),
    };
}

export async function fetchPendingOrders(): Promise<IncomingOrderResponse[]> {
    try {
        const { data } = await axiosClient.get<any[]>(
            `/restaurants/owners/me/incoming-orders?status=SUBMITTED`
        );

        const normalized = data.map(normalizeIncomingOrder);
        return normalized;
    } catch (error: any) {
        console.error("[orderService] Failed to fetch pending orders:", error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}

export async function fetchAcceptedOrders(): Promise<IncomingOrderResponse[]> {
    try {
        console.log("[orderService] Fetching accepted orders");
        const { data } = await axiosClient.get<any[]>(
            `/restaurants/owners/me/incoming-orders?status=ACCEPTED`
        );
        console.log("[orderService] ACCEPTED orders:", data);
        const normalized = data.map(normalizeIncomingOrder);
        console.log("[orderService] Normalized accepted orders:", normalized);
        return normalized;
    } catch (error: any) {
        console.error("[orderService] Failed to fetch accepted orders:", error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}

export async function acceptOrder(restaurantId: UUID, orderId: UUID) {
    try {
        const request: OrderStatusChangeRequest = { action: "ACCEPT" };
        const { data } = await axiosClient.patch(
            `/restaurants/${restaurantId}/orders/${orderId}`,
            request
        );
        return data;
    } catch (error: any) {
        console.error(`[orderService] Failed to accept order:`, error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}

export async function declineOrder(restaurantId: UUID, orderId: UUID, explanation?: string) {
    try {
        const request: OrderStatusChangeRequest = {
            action: "DECLINE",
            explanation: explanation
        };

        const { data } = await axiosClient.patch(
            `/restaurants/${restaurantId}/orders/${orderId}`,
            request
        );
        return data;
    } catch (error: any) {
        console.error(`[orderService] Failed to decline order:`, error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}

export async function markOrderReadyForPickup(restaurantId: UUID, orderId: UUID) {
    try {
        console.log(`[orderService] Marking order ${orderId} ready for pickup`);
        const request: OrderStatusChangeRequest = { action: "READY_FOR_PICKUP" };
        const { data } = await axiosClient.patch(
            `/restaurants/${restaurantId}/orders/${orderId}`,
            request
        );
        console.log(`[orderService] Order marked ready successfully:`, data);
        return data;
    } catch (error: any) {
        console.error(`[orderService] Failed to mark order ready:`, error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
}
