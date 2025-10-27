// src/api/customer/orderApi.ts
import axiosClient from "../lib/axiosClient";

export async function createOrderAndPaymentLink(restaurantId: string): Promise<string> {
    const { data } = await axiosClient.post(`/orders/${restaurantId}/orders`);
    return data.url;
}
