// src/owner/CreateRestaurantPage.tsx
import {
    Box, Container, Paper, TextField, MenuItem, Typography,
    Button, Divider, Snackbar, Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import OpeningHoursEditor, { type OpeningHour } from '../../components/OpeningEditorComponent.tsx';
import { useKeycloak } from "@react-keycloak/web";
import { useEnsureOwner, useCreateRestaurant } from '../../hooks/owner/useOwner.ts';
import { buildRestaurantFormData } from '../../services/owner/restaurantApi.ts';

const CUISINES = ['Italian', 'French', 'Japanese', 'Mexican', 'Indian', 'American'] as const;

type RestaurantFormData = {
    name: string;
    street: string;
    number: string;
    postalCode?: string;
    city: string;
    country: string;
    contactEmail: string;
    pictureUrls: string;
    cuisineType: string;
    defaultPreparationMinutes: number;
};

export default function CreateRestaurantPage() {
    const nav = useNavigate();
    const { keycloak, initialized } = useKeycloak();
    const [ok, setOk] = useState(false);

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RestaurantFormData>({
        defaultValues: {
            name: '',
            street: '',
            number: '',
            postalCode: '',
            city: '',
            country: '',
            contactEmail: '',
            pictureUrls: '',
            cuisineType: 'Italian',
            defaultPreparationMinutes: 20,
        },
    });

    const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);

    const ensureOwnerMutation = useEnsureOwner();
    const createRestaurantMutation = useCreateRestaurant();

    // Ensure Owner once using JWT
    useEffect(() => {
        if (!initialized || !keycloak.authenticated || !keycloak.token) return;
        ensureOwnerMutation.mutate();
    }, []);

    const onSubmit = async (data: RestaurantFormData) => {
        const fd = buildRestaurantFormData({
            name: data.name,
            email: data.contactEmail,
            cuisineType: (data.cuisineType || 'Italian').toUpperCase(),
            prepTime: Number(data.defaultPreparationMinutes) || 20,
            address: {
                street: data.street,
                number: data.number,                           // ✅ include number (required)
                postalCode: data.postalCode || undefined,
                city: data.city,
                country: data.country,
            },
            openingHours,
            pictureUrls: data.pictureUrls
                ? data.pictureUrls.split(',').map(s => s.trim()).filter(Boolean)
                : [],
        });

        createRestaurantMutation.mutate(fd, {
            onSuccess: () => {
                setOk(true);
                setTimeout(() => nav('/owner?refresh=true'), 900);
            },
        });
    };

    const error: Error | null = (ensureOwnerMutation.error || createRestaurantMutation.error) as Error | null;
    const ensured = ensureOwnerMutation.isSuccess;

    return (
        <Box sx={{ py: 6, background: 'linear-gradient(135deg, #eef7f0 0%, #ffffff 60%)' }}>
            <Container maxWidth="md">
                <Typography variant="h3" fontWeight={800} mb={3}>Create Restaurant</Typography>

                <Paper sx={{ p: 3, borderRadius: 3 }} elevation={4}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error.message || 'An error occurred'}
                        </Alert>
                    )}
                    {!ensured && ensureOwnerMutation.isPending && (
                        <Alert severity="info" sx={{ mb: 2 }}>Preparing your owner account…</Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            <Box sx={{ flex: '1 1 360px', minWidth: 280 }}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Restaurant name is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Restaurant name"
                                            required
                                            fullWidth
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            sx={{ mb: 2 }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="contactEmail"
                                    control={control}
                                    rules={{
                                        required: 'Contact email is required',
                                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Contact email"
                                            type="email"
                                            required
                                            fullWidth
                                            error={!!errors.contactEmail}
                                            helperText={errors.contactEmail?.message}
                                            sx={{ mb: 2 }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="cuisineType"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Cuisine type" select fullWidth sx={{ mb: 2 }}>
                                            {CUISINES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                        </TextField>
                                    )}
                                />

                                <Controller
                                    name="defaultPreparationMinutes"
                                    control={control}
                                    rules={{ min: { value: 0, message: 'Must be ≥ 0' } }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Default preparation (minutes)"
                                            type="number"
                                            fullWidth
                                            sx={{ mb: 2 }}
                                            error={!!errors.defaultPreparationMinutes}
                                            helperText={errors.defaultPreparationMinutes?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="pictureUrls"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Picture URLs (comma separated)" fullWidth />
                                    )}
                                />
                            </Box>

                            <Box sx={{ flex: '1 1 360px', minWidth: 280 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>Address</Typography>

                                <Controller
                                    name="street"
                                    control={control}
                                    rules={{ required: 'Street is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Street"
                                            required
                                            fullWidth
                                            error={!!errors.street}
                                            helperText={errors.street?.message}
                                            sx={{ mb: 2 }}
                                        />
                                    )}
                                />

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Controller
                                        name="number"
                                        control={control}
                                        rules={{ required: 'Number is required' }}   // ✅ required to match AddressDto
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Number"
                                                required
                                                fullWidth
                                                error={!!errors.number}
                                                helperText={errors.number?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="postalCode"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} label="Postal code" fullWidth />
                                        )}
                                    />
                                </Box>

                                <Box mt={2} />
                                <Controller
                                    name="city"
                                    control={control}
                                    rules={{ required: 'City is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="City"
                                            required
                                            fullWidth
                                            error={!!errors.city}
                                            helperText={errors.city?.message}
                                            sx={{ mb: 2 }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="country"
                                    control={control}
                                    rules={{ required: 'Country is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Country"
                                            required
                                            fullWidth
                                            error={!!errors.country}
                                            helperText={errors.country?.message}
                                        />
                                    )}
                                />

                                <Box my={3}><Divider /></Box>
                                <OpeningHoursEditor onChange={setOpeningHours} />
                            </Box>
                        </Box>

                        <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={() => window.history.back()}>Cancel</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting || !ensured}
                            >
                                {isSubmitting ? 'Saving…' : 'Create Restaurant'}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>

            <Snackbar open={ok} autoHideDuration={1500} onClose={() => setOk(false)}>
                <Alert severity="success" variant="filled">Restaurant created!</Alert>
            </Snackbar>
        </Box>
    );
}
