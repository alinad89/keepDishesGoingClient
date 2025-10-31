import { Paper, Skeleton } from '@mui/material';

/**
 * Loading skeleton for RestaurantCard component
 */
export default function RestaurantCardSkeleton() {
    return (
        <Paper sx={{ p: 2, flex: '1 1 260px', maxWidth: 360 }}>
            <Skeleton variant="text" width="70%" height={32} />
            <Skeleton variant="text" width="50%" height={20} sx={{ mt: 1 }} />
            <Skeleton variant="rectangular" width={80} height={24} sx={{ mt: 1, borderRadius: 3 }} />
            <Skeleton variant="rectangular" height={36} sx={{ mt: 2, borderRadius: 1 }} />
        </Paper>
    );
}
