// src/pages/customer/_components/BasketStatus.tsx
import { Alert } from '@mui/material';

export default function BasketStatus({ basketId }: { basketId?: string }) {
    if (!basketId) return null;
    return <Alert sx={{ mt: 2 }} severity="success">Basket ready: {basketId.slice(0, 8)}…</Alert>;
}
