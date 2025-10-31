// src/pages/kdg/KdgDashboardPage.tsx
import { Container, Typography, Box, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TuneIcon from "@mui/icons-material/Tune";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function KdgDashboardPage() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" gutterBottom fontWeight={800}>
                KDG Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Manage price range criteria and view restaurant analytics
            </Typography>

            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
                <Box flex={1}>
                    <Card
                        sx={{
                            height: "100%",
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 4,
                            },
                        }}
                        onClick={() => navigate("/kdg/price-bands")}
                    >
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <TuneIcon sx={{ fontSize: 40, color: "primary.main" }} />
                                <Typography variant="h5" fontWeight={700}>
                                    Price Bands Management
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Adjust the global price range criteria (CHEAP, REGULAR, EXPENSIVE, PREMIUM)
                                that determine how restaurants are categorized.
                            </Typography>
                            <Button variant="contained" fullWidth>
                                Manage Price Bands
                            </Button>
                        </CardContent>
                    </Card>
                </Box>

                <Box flex={1}>
                    <Card
                        sx={{
                            height: "100%",
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 4,
                            },
                        }}
                        onClick={() => navigate("/kdg/price-evolution")}
                    >
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <TrendingUpIcon sx={{ fontSize: 40, color: "primary.main" }} />
                                <Typography variant="h5" fontWeight={700}>
                                    Price Evolution
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                View historical price range evolution for restaurants over time.
                                Track how average prices and tier classifications change.
                            </Typography>
                            <Button variant="contained" fullWidth>
                                View Price Evolution
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    );
}
