// src/components/checkout/CheckoutSummary.tsx
import { Paper, Stack } from "@mui/material";
import type { CustomerInfo } from "./CustomerInfoForm.tsx"
import BasketSection from "./BasketSection";
import {CustomerInfoForm} from "./index.ts";
import type { BasketItem } from "../../types/basket";

type Props = {
    availableItems: BasketItem[];
    blockedItems?: BasketItem[];
    totalPrice: number;
    onCheckout: (data: CustomerInfo) => void;
    disabled?: boolean;
};

export default function CheckoutSummary({
                                            availableItems,
                                            blockedItems = [],
                                            totalPrice,
                                            onCheckout,
                                            disabled,
                                        }: Props) {
    return (
        <Paper sx={{ p: 4 }}>
            <Stack spacing={4}>
                <CustomerInfoForm onSubmit={onCheckout} disabled={disabled} />
                <BasketSection
                    availableItems={availableItems}
                    blockedItems={blockedItems}
                    totalPrice={totalPrice}
                />
            </Stack>
        </Paper>
    );
}
