// src/components/BasketItemList.tsx
import type { BasketItem } from "../../types/basket.ts";
import { BasketItemLine } from "./BasketItemLine.tsx";

interface BasketItemListProps {
    items: BasketItem[];
    totalPrice: number;
}

export function BasketItemList({ items, totalPrice }: BasketItemListProps) {
    return (
        <div style={{ padding: "1rem", background: "#fff", borderRadius: "12px" }}>
            {items.map((item, index) => (
                <BasketItemLine key={index} item={item} />
            ))}
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>Total</span>
                <span>€ {totalPrice.toFixed(2)}</span>
            </div>
        </div>
    );
}
