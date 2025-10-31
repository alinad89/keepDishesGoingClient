import { Paper, Typography, Button, Chip, Stack, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { RestaurantDto } from '../../types';
import { restaurantId, labelize } from '../../types';

type Props = {
    restaurant: RestaurantDto;
    etaMinutes?: number;
};

export default function RestaurantCard({ restaurant, etaMinutes }: Props) {
    const id = restaurantId(restaurant);

    if (!id) {
        console.warn('Restaurant missing ID:', restaurant);
        return null;
    }

    return (
        <Paper
            sx={{
                p: 2,
                flex: '1 1 260px',
                maxWidth: 360,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                },
            }}
        >
            <Typography variant="h6" fontWeight={600}>
                {restaurant.name ?? restaurant.email}
            </Typography>

            {restaurant.address && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {restaurant.address.city}
                        {restaurant.address.city && restaurant.address.country ? ', ' : ''}
                        {restaurant.address.country}
                    </Typography>
                </Stack>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {restaurant.cuisineType && (
                    <Chip
                        label={labelize(restaurant.cuisineType)}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                )}

                {etaMinutes !== undefined && (
                    <Chip
                        icon={<AccessTimeIcon />}
                        label={`${etaMinutes} min`}
                        size="small"
                        color="success"
                        variant="outlined"
                    />
                )}
            </Box>

            <Button
                component={Link}
                to={`/customer/restaurants/${id}`}
                variant="contained"
                size="small"
                fullWidth
                sx={{ mt: 'auto' }}
            >
                View Menu
            </Button>
        </Paper>
    );
}
