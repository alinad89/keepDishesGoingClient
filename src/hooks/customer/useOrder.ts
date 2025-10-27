// src/hooks/customer/useOrder.ts
import { useMutation } from "@tanstack/react-query";
import { createOrderAndPaymentLink } from "../../services/orderApi.ts";

export function useOrder() {
    const { mutate: startCheckout, isPending, isError, error } = useMutation({
        mutationKey: ["create-order-and-payment"],
        mutationFn: async (restaurantId: string) => {
            if (!restaurantId) throw new Error("Missing restaurantId");
            return await createOrderAndPaymentLink(restaurantId);
        },
        onError: (err) => console.error("Stripe checkout failed", err),
    });

    return { startCheckout, isPending, isError, error };
}
