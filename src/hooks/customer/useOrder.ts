// src/hooks/customer/useOrder.ts
import { useMutation } from "@tanstack/react-query";
import axiosClient from "../../lib/axiosClient";
import { ensureAnonymous } from "../../services/customer/customerService";

type CheckoutArgs = {
    restaurantId: string;
    data: CustomerInfoRequest;
};

type CustomerInfoRequest = {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    number: string;
    postalCode: string;
    city: string;
    country: string;
};

type PaymentLinkResponse = { url?: string; link?: string };

export function useOrder() {
    const mutation = useMutation({
        mutationFn: async ({
                               restaurantId,
                               data,
                           }: CheckoutArgs): Promise<{ url: string }> => {
            console.log("=== STARTING CHECKOUT ===");

            // Guarantee we have an anon id in localStorage (axios interceptor mirrors it to a cookie)
            await ensureAnonymous();

            const res = await axiosClient.post<PaymentLinkResponse>(
                `/orders/${restaurantId}/orders`,
                data,
                { withCredentials: true }
            );

            console.log("=== CHECKOUT RESPONSE ===", res.status, res.data);

            const url = res.data?.url ?? res.data?.link;
            if (!url) {
                throw new Error("Invalid response: missing payment URL");
            }
            return { url };
        },
    });

    const startCheckout = (
        restaurantId: string,
        data: CustomerInfoRequest,
        callbacks?: {
            onSuccess?: (url: string) => void;
            onError?: (err?: unknown) => void;
        }
    ) => {
        mutation.mutate(
            { restaurantId, data },
            {
                onSuccess: (result) => callbacks?.onSuccess?.(result.url),
                onError: (error) => callbacks?.onError?.(error),
            }
        );
    };

    return { startCheckout, isPending: mutation.isPending, error: mutation.error };
}
