import { Box, Container, Paper, Typography, Button, Chip, CircularProgress, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useMyRestaurant, useSetOpeningHours } from "../../hooks/owner/useOwner.ts";
import RestaurantOpeningControl from "../../components/owner/RestaurantOpeningControl";
import OpeningHoursEditor from "../../components/OpeningEditorComponent";
import type { OpeningHour } from "../../components/OpeningEditorComponent";

export default function RestaurantDetailsPage() {
    const { data: restaurant, isLoading } = useMyRestaurant();
    const setOpeningHoursMutation = useSetOpeningHours();
    const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
    const [successMsg, setSuccessMsg] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");

    const handleSaveOpeningHours = async () => {
        try {
            setErrorMsg("");
            setSuccessMsg("");
            await setOpeningHoursMutation.mutateAsync(openingHours);
            setSuccessMsg("Opening hours saved successfully!");
        } catch (error: any) {
            setErrorMsg(error?.response?.data?.message || "Failed to save opening hours");
        }
    };

    if (isLoading)
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

                {/* Opening Hours Schedule Editor */}
                <Box sx={{ mt: 3 }}>
                    {successMsg && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg("")}>
                            {successMsg}
                        </Alert>
                    )}
                    {errorMsg && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg("")}>
                            {errorMsg}
                        </Alert>
                    )}

                    <OpeningHoursEditor
                        value={openingHours}
                        onChange={setOpeningHours}
                        defaultOpen="09:00"
                        defaultClose="17:00"
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveOpeningHours}
                        disabled={setOpeningHoursMutation.isPending}
                        sx={{ mt: 2 }}
                    >
                        {setOpeningHoursMutation.isPending ? "Saving..." : "Save Opening Hours"}
                    </Button>
                </Box>

                {/* Manual Opening Control */}
                {(restaurant.id || restaurant.restaurantId) && (
                    <RestaurantOpeningControl
                        restaurantId={(restaurant.id || restaurant.restaurantId)!}
                        currentlyOpen={false}
                        manualControl={false}
                    />
                )}
            </Container>
        </Box>
    );
}
