import { useEffect, useState } from "react";
import { Box, Container, Paper, Typography, Button, Chip, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { getMyRestaurant } from "../../services/owner/restaurantApi.ts";
import type { RestaurantDto } from "../../types";

export default function RestaurantDetailsPage() {
    const [restaurant, setRestaurant] = useState<RestaurantDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getMyRestaurant(); // ✅ fetches via /services/restaurants/me
                setRestaurant(res);
            } catch (err) {
                console.error("Failed to fetch restaurant", err);
                setRestaurant(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );

    if (!restaurant)
        return (
            <Container sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="h5">Restaurant not found.</Typography>
                <Button variant="outlined" component={Link} to="/owner" sx={{ mt: 2 }}>
                    Back to Dashboard
                </Button>
            </Container>
        );

    const { name, email, address, cuisineType, prepTime, pictureURL} = restaurant;

    return (
        <Box sx={{ py: 6, background: "linear-gradient(135deg, #eef7f0 0%, #ffffff 60%)" }}>
            <Container maxWidth="md">
                <Typography variant="h3" fontWeight={800} mb={3}>
                    {name}
                </Typography>

                <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                        {/* Image */}
                        <Box sx={{ flex: "0 0 320px", alignSelf: "flex-start" }}>
                            <Box
                                component="img"
                                src={pictureURL?.[0] || "/placeholder.png"}
                                alt={name}
                                sx={{
                                    width: "100%",
                                    height: 220,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    boxShadow: 2,
                                }}
                            />
                        </Box>

                        {/* Info */}
                        <Box sx={{ flex: "1 1 auto" }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Chip label={cuisineType} color="success" variant="outlined" />
                                <Chip label={`${prepTime} min prep`} variant="outlined" />
                            </Box>

                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Contact
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                {email}
                            </Typography>

                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Address
                            </Typography>
                            <Typography color="text.secondary">
                                {address.street}, {address.postalCode} {address.city}, {address.country}
                            </Typography>

                            <Box mt={4} display="flex" gap={2} flexWrap="wrap">
                                <Button
                                    component={Link}
                                    to={`/owner/restaurants/${restaurant.id}/dishes/new`}
                                    variant="contained"
                                    color="primary"
                                >
                                    Create Dish
                                </Button>

                                <Button
                                    component={Link}
                                    to="/owner/dishes"
                                    variant="outlined"
                                    color="secondary"
                                >
                                    Manage Dishes
                                </Button>

                                <Button
                                    component={Link}
                                    to="/owner"
                                    variant="outlined"
                                >
                                    Back to Dashboard
                                </Button>

                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
