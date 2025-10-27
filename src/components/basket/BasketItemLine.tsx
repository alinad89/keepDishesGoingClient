// src/components/BasketItemLine.tsx
import type { BasketItem } from "../../types/basket.ts";

interface BasketItemLineProps {
    item: BasketItem;
}

export function BasketItemLine({ item }: BasketItemLineProps) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
                × {item.quantity} — {item.dishName}
            </span>
            <span>€ {(item.unitPrice * item.quantity).toFixed(2)}</span>
        </div>
    );
}
