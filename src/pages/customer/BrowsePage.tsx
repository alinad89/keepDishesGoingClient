// src/pages/customer/BrowsePage.tsx
import { Box, Container, Typography, Paper, Alert, Skeleton, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomerRestaurants } from '../../services/customer/restaurantService.ts';
import { CUISINES, labelize, restaurantId, type RestaurantDto } from '../../types';

export default function BrowsePage() {
    const [params, setParams] = useSearchParams();
    const cuisineType = params.get('cuisineType') ?? '';

    const { data = [], isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ['customer-restaurants', { cuisineType }],
        queryFn: () => fetchCustomerRestaurants(cuisineType ? { cuisineType } : {}),
        staleTime: 60_000,
        retry: false,
    });

    const onCuisineChange = (value: string) => {
        const next = new URLSearchParams(params);
        if (value) next.set('cuisineType', value); else next.delete('cuisineType');
        setParams(next, { replace: true });
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>Find a restaurant</Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel>Cuisine</InputLabel>
                    <Select
                        label="Cuisine"
                        value={cuisineType}
                        onChange={(e) => onCuisineChange(e.target.value)}
                    >
                        <MenuItem value=""><em>All cuisines</em></MenuItem>
                        {CUISINES.map(c => (
                            <MenuItem key={c} value={c}>{labelize(c)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {(error as any)?.message ?? 'Failed to load restaurants.'}
                    <Button sx={{ ml: 2 }} size="small" onClick={() => refetch()} disabled={isFetching}>
                        Retry
                    </Button>
                </Alert>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <Paper key={i} sx={{ p: 2, flex: '1 1 260px', maxWidth: 360 }}>
                            <Skeleton variant="text" width="70%" />
                            <Skeleton variant="text" width="50%" />
                            <Skeleton variant="rectangular" height={32} sx={{ mt: 1 }} />
                        </Paper>
                    ))
                    : (data as RestaurantDto[]).length === 0
                        ? <Alert severity="info">No restaurants found.</Alert>
                        : (data as RestaurantDto[]).map((r) => {
                            const id = restaurantId(r)!;
                            return (
                                <Paper key={id} sx={{ p: 2, flex: '1 1 260px', maxWidth: 360 }}>
                                    <Typography variant="h6">{r.name ?? r.email}</Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        {r.address?.city}{r.address?.city && r.address?.country ? ', ' : ''}{r.address?.country}
                                    </Typography>
                                    <Button component={Link} to={`/customer/restaurants/${id}`} size="small">
                                        View menu
                                    </Button>
                                </Paper>
                            );
                        })}
            </Box>
        </Container>
    );
}
