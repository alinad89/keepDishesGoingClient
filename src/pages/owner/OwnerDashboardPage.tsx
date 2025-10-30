// src/owner/OwnerDashboardPage.tsx
import { Container, Card, CardContent, Typography, Button, Box, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useMyRestaurant } from "../../hooks/owner/useOwner.ts";

export default function OwnerDashboardPage() {
    const { data: restaurant, isLoading } = useMyRestaurant();

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ py: 6 }}>
            <Typography variant="h3" fontWeight={800} textAlign="center" mb={4}>
                Owner Console
            </Typography>

            {restaurant ? (
                <Card sx={{ p: 3, maxWidth: 600, mx: "auto", borderRadius: 3, textAlign: "center" }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>{restaurant.name}</Typography>
                        <Typography variant="body1">
                            {restaurant.address?.city}, {restaurant.address?.country}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            {restaurant.cuisineType} • {restaurant.email}
                        </Typography>
                    </CardContent>

                    <Button
                        component={Link}
                        to={`/owner/restaurants/${restaurant.id}`}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        View Restaurant
                    </Button>
                </Card>
            ) : (
                <Card sx={{ p: 3, maxWidth: 600, mx: "auto", borderRadius: 3, textAlign: "center" }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            You don’t have a restaurant yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Create your first restaurant to get started.
                        </Typography>
                        <Button
                            component={Link}
                            to="/owner/create-restaurant"
                            variant="contained"
                            color="primary"
                        >
                            Create Restaurant
                        </Button>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}
