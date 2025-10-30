// src/components/checkout/CheckoutSummary.tsx
import { Paper, Stack } from "@mui/material";
import type { CustomerInfo } from "./CustomerInfoForm.tsx"
import BasketSection from "./BasketSection";
import {CustomerInfoForm} from "./index.ts";

type Props = {
    items: any[];
    totalPrice: number;
    onCheckout: (data: CustomerInfo) => void;
    disabled?: boolean;
};

export default function CheckoutSummary({
                                            items,
                                            totalPrice,
                                            onCheckout,
                                            disabled,
                                        }: Props) {
    return (
        <Paper sx={{ p: 4 }}>
            <Stack spacing={4}>
                <CustomerInfoForm onSubmit={onCheckout} disabled={disabled} />
                <BasketSection items={items} totalPrice={totalPrice} />
            </Stack>
        </Paper>
    );
}
