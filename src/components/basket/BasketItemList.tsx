// src/components/BasketItemList.tsx
import { Box, Divider, Typography, Alert } from "@mui/material";
import type { BasketItem } from "../../types/basket.ts";
import { BasketItemLine } from "./BasketItemLine.tsx";

interface BasketItemListProps {
    availableItems: BasketItem[];
    blockedItems?: BasketItem[];
    totalPrice: number;
}

export function BasketItemList({ availableItems, blockedItems = [], totalPrice }: BasketItemListProps) {
    return (
        <Box sx={{ padding: "1rem", background: "#fff", borderRadius: "12px" }}>
            {availableItems.map((item, index) => (
                <BasketItemLine key={`available-${item.dishId}-${index}`} item={item} />
            ))}

            {blockedItems.length > 0 && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Some items are no longer available and cannot be ordered
                    </Alert>
                    {blockedItems.map((item, index) => (
                        <BasketItemLine key={`blocked-${item.dishId}-${index}`} item={item} />
                    ))}
                </>
            )}

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <Typography variant="body1" fontWeight="bold">Total</Typography>
                <Typography variant="body1" fontWeight="bold">€ {totalPrice.toFixed(2)}</Typography>
            </Box>
        </Box>
    );
}
