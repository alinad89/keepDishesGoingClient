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
        console.log("[orderService] Fetching pending orders");
        const { data } = await axiosClient.get<any[]>(
            `/restaurants/owners/me/incoming-orders?status=SUBMITTED`
        );

        console.log("[orderService] PENDING orders raw:", data);
        const normalized = data.map(normalizeIncomingOrder);
        console.log("[orderService] PENDING orders normalized:", normalized);
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
        console.log(`[orderService] ===== ACCEPT ORDER STARTED =====`);
        console.log(`[orderService] Restaurant ID:`, restaurantId);
        console.log(`[orderService] Order ID:`, orderId);

        const request: OrderStatusChangeRequest = { action: "ACCEPT" };
        console.log(`[orderService] Request payload:`, request);

        const url = `/restaurants/${restaurantId}/orders/${orderId}`;
        console.log(`[orderService] Request URL:`, url);

        const { data } = await axiosClient.patch(url, request);

        console.log(`[orderService] Accept order SUCCESS:`, data);
        console.log(`[orderService] ===== ACCEPT ORDER COMPLETED =====`);
        return data;
    } catch (error: any) {
        console.error(`[orderService] ===== ACCEPT ORDER FAILED =====`);
        console.error(`[orderService] Error object:`, error);
        console.error(`[orderService] Restaurant ID:`, restaurantId);
        console.error(`[orderService] Order ID:`, orderId);
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
