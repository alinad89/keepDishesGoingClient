// src/owner/CreateRestaurantPage.tsx
import {
    Box, Container, Paper, TextField, MenuItem, Typography,
    Button, Divider, Snackbar, Alert,
} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import OpeningHoursEditor, { type OpeningHour } from '../../components/OpeningEditorComponent.tsx';
import { useKeycloak } from "@react-keycloak/web";
import { ensureOwner } from '../../services/owner/ownerService.ts';
import { buildRestaurantFormData, createRestaurant } from '../../services/owner/restaurantApi.ts';

const CUISINES = ['Italian','French','Japanese','Mexican','Indian','American'];

export default function CreateRestaurantPage() {
    const nav = useNavigate();
    const { keycloak, initialized } = useKeycloak();
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [ok, setOk] = useState(false);
    const [ensured, setEnsured] = useState(false);
    const ran = useRef(false);

    //todo use form
    const [form, setForm] = useState({
        name: '',
        street: '', number: '',
        postalCode: '', city: '', country: '',
        contactEmail: '',
        pictureUrls: '',
        cuisineType: '',
        defaultPreparationMinutes: 20,
    });

    // Opening hours state
    const [openingHours, setOpeningHours] = useState<
        { day: OpeningHour['day']; open: string; close: string }[]
    >([]);

    const on = (k: keyof typeof form) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));

    // Ensure Owner once using JWT (axios interceptor adds token)
    useEffect(() => {
        if (ran.current) return;
        if (!initialized || !keycloak.authenticated || !keycloak.token) return;

        ran.current = true;
        (async () => {
            try {
                await ensureOwner();
                setEnsured(true);
            } catch (e: any) {
                setErr(e?.message ?? 'Ensure failed');
            }
        })();
    }, [initialized, keycloak, keycloak.authenticated, keycloak.token]);

    const submit = async () => {
        setErr(null);
        if (!form.name || !form.street || !form.city || !form.country || !form.contactEmail) {
            setErr('Please fill in the required fields.');
            return;
        }
        setLoading(true);

        try {
            const fd = buildRestaurantFormData({
                name: form.name,
                email: form.contactEmail,
                cuisineType: (form.cuisineType || 'Italian').toUpperCase(),
                prepTime: Number(form.defaultPreparationMinutes) || 20,
                address: {
                    street: form.street + (form.number ? ` ${form.number}` : ''),
                    postalCode: form.postalCode || undefined,
                    city: form.city,
                    country: form.country,
                },
                openingHours,
                pictureUrls: form.pictureUrls.split(',').map(s => s.trim()).filter(Boolean),
            });
//todo use custom hook
            await createRestaurant(fd); // comment this out if you don’t have the controller yet

            setLoading(false);
            setOk(true);
            setTimeout(() => nav('/owner?refresh=true'), 900);
        } catch (e: any) {
            setLoading(false);
            setErr(e?.message ?? 'Failed to create restaurant');
        }
    };

    return (
        <Box sx={{ py: 6, background: 'linear-gradient(135deg, #eef7f0 0%, #ffffff 60%)' }}>
            <Container maxWidth="md">
                <Typography variant="h3" fontWeight={800} mb={3}>Create Restaurant</Typography>

                <Paper sx={{ p: 3, borderRadius: 3 }} elevation={4}>
                    {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
                    {!ensured && <Alert severity="info" sx={{ mb: 2 }}>Preparing your owner account…</Alert>}

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        <Box sx={{ flex: '1 1 360px', minWidth: 280 }}>
                            <TextField label="Restaurant name" required fullWidth value={form.name} onChange={on('name')} sx={{ mb: 2 }} />
                            <TextField label="Contact email" type="email" required fullWidth value={form.contactEmail} onChange={on('contactEmail')} sx={{ mb: 2 }} />
                            <TextField label="Cuisine type" select fullWidth value={form.cuisineType} onChange={on('cuisineType')} sx={{ mb: 2 }}>
                                {CUISINES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </TextField>
                            <TextField label="Default preparation (minutes)" type="number" fullWidth value={form.defaultPreparationMinutes} onChange={on('defaultPreparationMinutes')} sx={{ mb: 2 }} />
                            <TextField label="Picture URLs (comma separated)" fullWidth value={form.pictureUrls} onChange={on('pictureUrls')} />
                        </Box>

                        <Box sx={{ flex: '1 1 360px', minWidth: 280 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Address</Typography>
                            <TextField label="Street" required fullWidth value={form.street} onChange={on('street')} sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField label="Number" fullWidth value={form.number} onChange={on('number')} />
                                <TextField label="Postal code" fullWidth value={form.postalCode} onChange={on('postalCode')} />
                            </Box>
                            <Box mt={2} />
                            <TextField label="City" required fullWidth value={form.city} onChange={on('city')} sx={{ mb: 2 }} />
                            <TextField label="Country" required fullWidth value={form.country} onChange={on('country')} />
                            <Box my={3}><Divider /></Box>
                            <OpeningHoursEditor onChange={setOpeningHours} />
                        </Box>
                    </Box>

                    <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
                        <Button variant="outlined" onClick={() => window.history.back()}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={submit} disabled={loading || !ensured}>
                            {loading ? 'Saving…' : 'Create Restaurant'}
                        </Button>
                    </Box>
                </Paper>
            </Container>

            <Snackbar open={ok} autoHideDuration={1500} onClose={() => setOk(false)}>
                <Alert severity="success" variant="filled">Restaurant created!</Alert>
            </Snackbar>
        </Box>
    );
}
