// src/pages/customer/_components/BasketStatus.tsx
import { Alert } from '@mui/material';

export default function BasketStatus({ restaurantId, isBlocked }: { restaurantId?: string | null, isBlocked?: boolean }) {
    if (!restaurantId) return null;

    if (isBlocked) {
        return (
            <Alert sx={{ mt: 2 }} severity="warning">
                Some items in your basket are no longer available. Please review your basket before checkout.
            </Alert>
        );
    }

    return null;
}
