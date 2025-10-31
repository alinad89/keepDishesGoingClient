// src/pages/customer/BrowsePage.tsx
import { Box, Container, Typography, Alert, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomerRestaurants } from '../../services/customer/restaurantService.ts';
import { CUISINES, labelize, type RestaurantDto } from '../../types';
import { getErrorMessage } from '../../utils/errors';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import RestaurantCardSkeleton from '../../components/common/RestaurantCardSkeleton';
import { useRestaurantsWithEta } from '../../hooks/customer/useRestaurantsWithEta';

export default function BrowsePage() {
    const [params, setParams] = useSearchParams();
    const cuisineType = params.get('cuisineType') ?? '';

    // Try to fetch restaurants with ETA (requires geolocation)
    const {
        restaurantsWithEta,
        isLoading: isLoadingWithEta,
        isError: isErrorWithEta,
        error: errorWithEta,
        hasLocation,
    } = useRestaurantsWithEta(cuisineType ? { cuisineType } : {});

    // Fallback: fetch restaurants without ETA if geolocation is not available
    const { data: restaurantsWithoutEta = [], isLoading: isLoadingWithoutEta, isError: isErrorWithoutEta, error: errorWithoutEta, refetch, isFetching } = useQuery({
        queryKey: ['customer-restaurants', { cuisineType }],
        queryFn: () => fetchCustomerRestaurants(cuisineType ? { cuisineType } : {}),
        staleTime: 60_000,
        retry: false,
        enabled: !hasLocation,
    });

    const onCuisineChange = (value: string) => {
        const next = new URLSearchParams(params);
        if (value) next.set('cuisineType', value); else next.delete('cuisineType');
        setParams(next, { replace: true });
    };

    // Determine which data to show
    const isLoading = hasLocation ? isLoadingWithEta : isLoadingWithoutEta;
    const isError = hasLocation ? isErrorWithEta : isErrorWithoutEta;
    const error = hasLocation ? errorWithEta : errorWithoutEta;
    const data = hasLocation ? restaurantsWithEta : restaurantsWithoutEta;

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

            {!hasLocation && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Enable location access to see estimated delivery times.
                </Alert>
            )}

            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {getErrorMessage(error)}
                    {!hasLocation && (
                        <Button sx={{ ml: 2 }} size="small" onClick={() => refetch()} disabled={isFetching}>
                            Retry
                        </Button>
                    )}
                </Alert>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <RestaurantCardSkeleton key={i} />
                    ))
                ) : data.length === 0 ? (
                    <Alert severity="info">No restaurants found.</Alert>
                ) : (
                    data.map((item) => {
                        const restaurant = 'restaurant' in item ? item.restaurant : item as RestaurantDto;
                        const eta = 'etaMinutes' in item ? item.etaMinutes : undefined;
                        return (
                            <RestaurantCard
                                key={restaurant.id || restaurant.restaurantId}
                                restaurant={restaurant}
                                etaMinutes={eta}
                            />
                        );
                    })
                )}
            </Box>
        </Container>
    );
}
