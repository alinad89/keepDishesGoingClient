// src/owner/CreateDishPage.tsx
import { Box, Container, Paper, TextField, MenuItem, Typography, Button, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateDish } from '../../hooks/owner/useDishes.ts';
import type { DishType } from '../../types';

const TYPES: DishType[] = ['STARTER', 'MAIN', 'DESSERT'];

export default function CreateDishPage() {
    const nav = useNavigate();
    const createDish = useCreateDish();

    const [err, setErr] = useState<string | null>(null);
    const [ok, setOk] = useState(false);

    const [form, setForm] = useState({
        name: '',
        type: 'MAIN' as DishType,
        tags: '',
        description: '',
        price: '',
        pictureUrl: '',
    });

    const on = (k: keyof typeof form) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));

    //TODO refactor for a proper form
    const submit = () => {
        setErr(null);
        if (!form.name || !form.price) {
            setErr('Name and price are required.');
            return;
        }
        createDish.mutate(
            {
                name: form.name,
                type: form.type,
                tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : undefined,
                description: form.description || undefined,
                price: Number(form.price),
                pictureUrl: form.pictureUrl || undefined,
            },
            {
                onSuccess: () => {
                    setOk(true);
                    setTimeout(() => nav('/owner'), 900);
                },
                onError: (e: any) => setErr(e?.message ?? 'Failed to create dish'),
            }
        );
    };

    return (
        <Box sx={{ py: 6, background: 'linear-gradient(135deg, #eef7f0 0%, #ffffff 60%)' }}>
            <Container maxWidth="md">
                <Typography variant="h3" fontWeight={800} mb={3}>Create Dish</Typography>

                <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
                    {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        <Box sx={{ flex: '1 1 360px', minWidth: 280 }}>
                            <TextField label="Dish name" required fullWidth value={form.name} onChange={on('name')} sx={{ mb: 2 }} />
                            <TextField label="Type" select fullWidth value={form.type} onChange={on('type')} sx={{ mb: 2 }}>
                                {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </TextField>
                            <TextField label="Tags (comma separated)" fullWidth value={form.tags} onChange={on('tags')} />
                        </Box>

                        <Box sx={{ flex: '1 1 360px', minWidth: 280 }}>
                            <TextField label="Price (€)" type="number" required fullWidth value={form.price} onChange={on('price')} sx={{ mb: 2 }} />
                            <TextField label="Picture URL" fullWidth value={form.pictureUrl} onChange={on('pictureUrl')} sx={{ mb: 2 }} />
                            <TextField label="Description" fullWidth multiline minRows={5} value={form.description} onChange={on('description')} />
                        </Box>
                    </Box>

                    <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
                        <Button variant="outlined" onClick={() => window.history.back()}>Cancel</Button>
                        <Button variant="contained" color="secondary" onClick={submit} disabled={createDish.isPending}>
                            {createDish.isPending ? 'Saving…' : 'Create Dish'}
                        </Button>
                    </Box>
                </Paper>
            </Container>

            <Snackbar open={ok} autoHideDuration={1500} onClose={() => setOk(false)}>
                <Alert severity="success" variant="filled">Dish created!</Alert>
            </Snackbar>
        </Box>
    );
}
