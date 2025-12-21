import type {PaymentLinkGeneratedResponse} from "../types/payment.types.ts";
import {useMutation} from "@tanstack/react-query";
import {generatePaymentLink} from "../api/payment.ts";
import {ApiError} from "../api/config.ts";

/**
 * Hook to generate payment link
 * POST /api/games/{gameId}/purchase-session
 */
export function usePaymentLink(){
    const { mutate, isPending, isError, error } = useMutation<PaymentLinkGeneratedResponse,ApiError,string>({
        mutationFn: (gameId: string)=> generatePaymentLink(gameId),
    });
    return {
        createPaymentLink: mutate,
        loading: isPending,
        error: error,
        isError,
    }
}