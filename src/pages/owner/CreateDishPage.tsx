// src/owner/CreateDishPage.tsx
import { Box, Container, Paper, TextField, MenuItem, Typography, Button, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useCreateDish } from '../../hooks/owner/useDishes.ts';
import type { DishType } from '../../types';

const TYPES: DishType[] = ['STARTER', 'MAIN', 'DESSERT'];

type DishFormData = {
    name: string;
    type: DishType;
    tags: string;
    description: string;
    price: number;
    pictureUrl: string;
};

export default function CreateDishPage() {
    const nav = useNavigate();
    const { id: restaurantId } = useParams<{ id: string }>();
    const createDish = useCreateDish();

    const [ok, setOk] = useState(false);

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<DishFormData>({
        defaultValues: {
            name: '',
            type: 'MAIN',
            tags: '',
            description: '',
            price: 0,
            pictureUrl: '',
        },
    });

    const onSubmit = (data: DishFormData) => {
        if (!restaurantId) {
            return;
        }

        createDish.mutate(
            {
                restaurantId,
                name: data.name,
                type: data.type,
                tags: data.tags ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : undefined,
                description: data.description || undefined,
                price: Number(data.price),
                pictureUrl: data.pictureUrl || undefined,
            },
            {
                onSuccess: () => {
                    setOk(true);
                    setTimeout(() => nav('/owner'), 900);
                },
            }
        );
    };

    return (
        <Box sx={{ py: 6, background: 'linear-gradient(135deg, #eef7f0 0%, #ffffff 60%)' }}>
            <Container maxWidth="md">
                <Typography variant="h3" fontWeight={800} mb={3}>Create Dish</Typography>

                <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
                    {createDish.isError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {createDish.error instanceof Error ? createDish.error.message : 'Failed to create dish'}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            <Box sx={{ flex: '1 1 360px', minWidth: 280 }}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Dish name is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Dish name"
                                            required
                                            fullWidth
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            sx={{ mb: 2 }}
                                        />
                                    )}
                                />
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Type" select fullWidth sx={{ mb: 2 }}>
                                            {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                        </TextField>
                                    )}
                                />
                                <Controller
                                    name="tags"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Tags (comma separated)" fullWidth />
                                    )}
                                />
                            </Box>

                            <Box sx={{ flex: '1 1 360px', minWidth: 280 }}>
                                <Controller
                                    name="price"
                                    control={control}
                                    rules={{
                                        required: 'Price is required',
                                        min: { value: 0, message: 'Price must be positive' },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Price (€)"
                                            type="number"
                                            required
                                            fullWidth
                                            error={!!errors.price}
                                            helperText={errors.price?.message}
                                            sx={{ mb: 2 }}
                                        />
                                    )}
                                />
                                <Controller
                                    name="pictureUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Picture URL" fullWidth sx={{ mb: 2 }} />
                                    )}
                                />
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Description" fullWidth multiline minRows={5} />
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={() => window.history.back()}>Cancel</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                disabled={isSubmitting || createDish.isPending}
                            >
                                {createDish.isPending ? 'Saving…' : 'Create Dish'}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>

            <Snackbar open={ok} autoHideDuration={1500} onClose={() => setOk(false)}>
                <Alert severity="success" variant="filled">Dish created!</Alert>
            </Snackbar>
        </Box>
    );
}
