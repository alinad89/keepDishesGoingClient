// src/components/checkout/BasketSection.tsx
import { Typography, Divider, Box } from "@mui/material";
import { BasketItemList } from "../basket/BasketItemList";
import type { BasketItem } from "../../types/basket";

type Props = {
    availableItems: BasketItem[];
    blockedItems?: BasketItem[];
    totalPrice: number;
};

export default function BasketSection({ availableItems, blockedItems = [], totalPrice }: Props) {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Basket
            </Typography>
            <BasketItemList
                availableItems={availableItems}
                blockedItems={blockedItems}
                totalPrice={totalPrice}
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" align="right">
                Total: €{totalPrice.toFixed(2)}
            </Typography>
        </Box>
    );
}
