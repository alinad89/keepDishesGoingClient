// src/utils/money.ts
export const formatEUR = (v: number) => `€${(v ?? 0).toFixed(2)}`;

export const calcBasketTotals = (items: Array<{ price?: number; quantity: number }>) => {
    const subtotal = (items ?? []).reduce((s, it) => s + ((it.price ?? 0) * (it.quantity ?? 0)), 0);
    return { subtotal, total: subtotal }; // add delivery/discount here if you have them
};
