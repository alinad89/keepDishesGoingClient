// src/pages/customer/_components/BasketInfo.tsx
import { Alert } from '@mui/material';
export default function BasketInfo({ show }: { show: boolean }) {
    if (!show) return null;
    return <Alert severity="info" sx={{ mb: 2 }}>Open a restaurant first to create a basket.</Alert>;
}
