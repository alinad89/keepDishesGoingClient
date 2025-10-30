// src/components/checkout/BasketSection.tsx
import { Typography, Divider, Box } from "@mui/material";
import { BasketItemList } from "../basket/BasketItemList";

type Props = {
    items: any[];
    totalPrice: number;
};

export default function BasketSection({ items, totalPrice }: Props) {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Basket
            </Typography>
            <BasketItemList items={items} totalPrice={totalPrice} />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" align="right">
                Total: €{totalPrice.toFixed(2)}
            </Typography>
        </Box>
    );
}
