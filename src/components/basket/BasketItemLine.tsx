// src/components/BasketItemLine.tsx
import { Box, Chip } from "@mui/material";
import type { BasketItem } from "../../types/basket.ts";

interface BasketItemLineProps {
    item: BasketItem;
}

export function BasketItemLine({ item }: BasketItemLineProps) {
    const isBlocked = item.state === "OUT_OF_STOCK" || item.state === "DELETED";
    const stateLabel = item.state === "OUT_OF_STOCK" ? "Out of Stock" : item.state === "DELETED" ? "Unavailable" : null;

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: isBlocked ? 0.6 : 1,
            textDecoration: isBlocked ? "line-through" : "none",
            py: 0.5
        }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                <span>
                    × {item.quantity} — {item.dishName}
                </span>
                {stateLabel && (
                    <Chip
                        label={stateLabel}
                        size="small"
                        color="error"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                )}
            </Box>
            <span>€ {(item.unitPrice * item.quantity).toFixed(2)}</span>
        </Box>
    );
}
