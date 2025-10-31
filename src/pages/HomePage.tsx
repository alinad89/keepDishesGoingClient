// src/pages/HomeLanding.tsx
import { Box, Container, Typography, Button, Card, CardContent, CardActions } from "@mui/material";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const cardSx = {
    width: 340,
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    p: 3,
    textAlign: "center",
    borderRadius: 3,
    bgcolor: "rgba(255,255,255,0.08)",
    color: "#eaf6ef",
    border: "1px solid rgba(255,255,255,.12)",
    backdropFilter: "blur(10px)",
};

export default function HomeLanding() {
    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 72px)",
                position: "relative",
                overflow: "hidden",
                // dish.jpg as background
                backgroundImage: `url('/dish.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                // dark gradient overlay via ::after
                "&:after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(180deg, rgba(12,16,14,0.78) 0%, rgba(12,16,14,0.92) 60%)",
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 6, md: 10 } }}>
                {/* Hero row (flex only) */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: { xs: "stretch", md: "center" },
                        justifyContent: "space-between",
                        gap: { xs: 4, md: 6 },
                        color: "#eaf6ef",
                    }}
                >
                    {/* Left: headline + ctas */}
                    <Box sx={{ flex: "1 1 520px" }}>
                        <Typography variant="h2" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                            Keep Dishes Going
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 2, opacity: 0.85, maxWidth: 640 }}>
                            Fresh, clear and reliable ordering. Owners manage menus; customers order with confidence.
                        </Typography>

                        <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <Button component={Link} to="/customer" variant="contained" color="primary" size="large">
                                Explore Restaurants
                            </Button>
                            <Button component={Link} to="/start-owner" variant="outlined" color="inherit" size="large"
                                    sx={{ borderColor: "rgba(255,255,255,.24)", color: "#eaf6ef" }}>
                                I’m an Owner
                            </Button>
                        </Box>
                    </Box>

                    {/* Right: two cards */}
                    <Box
                        sx={{
                            flex: "0 1 520px",
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row", md: "column" },
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 3,
                        }}
                    >
                        <Card elevation={8} sx={cardSx}>
                            <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
                                <PersonIcon sx={{ fontSize: 56, color: "primary.main" }} />
                            </Box>
                            <CardContent>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    Customer
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,.75)" }}>
                                    Explore restaurants and order your favorite meals.
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                                <Button component={Link} to="/customer" variant="contained" color="primary" size="large">
                                    Continue
                                </Button>
                            </CardActions>
                        </Card>

                        <Card elevation={8} sx={cardSx}>
                            <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
                                <StoreIcon sx={{ fontSize: 56, color: "secondary.main" }} />
                            </Box>
                            <CardContent>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    Owner
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,.75)" }}>
                                    Create your restaurant and manage your live menu.
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                                <Button component={Link} to="/start-owner" variant="contained" color="secondary" size="large">
                                    Start as Owner
                                </Button>
                            </CardActions>
                        </Card>

                        <Card elevation={8} sx={cardSx}>
                            <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
                                <AdminPanelSettingsIcon sx={{ fontSize: 56, color: "warning.main" }} />
                            </Box>
                            <CardContent>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    KDG Admin
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,.75)" }}>
                                    Manage price bands and view restaurant analytics.
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                                <Button component={Link} to="/start-kdg" variant="contained" color="warning" size="large">
                                    Admin Console
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
