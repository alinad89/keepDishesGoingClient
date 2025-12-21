import type {PaymentLinkGeneratedResponse} from "../types/payment.types.ts";
import {apiPost, PLATFORM_ENDPOINTS} from "./config.ts";

/**
 * Generate payment link
 * POST /api/games/{gameId}/purchase-session
 */
export async function generatePaymentLink(gameId: string): Promise<PaymentLinkGeneratedResponse> {
  return await apiPost<PaymentLinkGeneratedResponse>(
    PLATFORM_ENDPOINTS.paymentLinkGeneration(gameId)
  );
}
