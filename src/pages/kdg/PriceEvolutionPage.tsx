// src/pages/kdg/PriceEvolutionPage.tsx
import { useState } from "react";
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
} from "@mui/material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { useCustomerRestaurants } from "../../hooks/customer/useCustomerRestaurants";
import { usePriceSnapshots } from "../../hooks/kdg/usePriceSnapshots";
import { usePriceBands } from "../../hooks/kdg/usePriceBands";
import { restaurantId, labelize } from "../../types";
import type { UUID, PriceTier } from "../../types";

function getTierNumber(tier: PriceTier): number {
    switch (tier) {
        case "CHEAP":
            return 1;
        case "REGULAR":
            return 2;
        case "EXPENSIVE":
            return 3;
        case "PREMIUM":
            return 4;
        default:
            return 2;
    }
}

function getTierSymbol(tier: PriceTier): string {
    switch (tier) {
        case "CHEAP":
            return "€";
        case "REGULAR":
            return "€€";
        case "EXPENSIVE":
            return "€€€";
        case "PREMIUM":
            return "€€€€";
        default:
            return "€€";
    }
}

export default function PriceEvolutionPage() {
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<UUID | null>(null);
    const { restaurants, isLoading: loadingRestaurants } = useCustomerRestaurants();
    const { data: snapshots, isLoading: loadingSnapshots, error } = usePriceSnapshots(selectedRestaurantId);
    const { data: priceBands } = usePriceBands();

    const handleRestaurantChange = (restaurantIdValue: string) => {
        setSelectedRestaurantId(restaurantIdValue || null);
    };

    // Prepare chart data - tier already calculated by backend based on CURRENT bands
    const chartData = snapshots?.map((snapshot) => {
        return {
            date: new Date(snapshot.occurredAt).toLocaleDateString(),
            time: new Date(snapshot.occurredAt).toLocaleTimeString(),
            tierValue: getTierNumber(snapshot.priceTier),
            tierName: labelize(snapshot.priceTier),
            tierSymbol: getTierSymbol(snapshot.priceTier),
        };
    }) || [];

    // Debug logging
    console.log("📊 Snapshots:", snapshots);
    console.log("📊 Chart Data:", chartData);
    console.log("📊 Price Bands:", priceBands);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" gutterBottom fontWeight={800}>
                Restaurant Price Evolution
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                View historical price changes re-classified to today's price standards
            </Typography>

            {/* Price Range Legend */}
            <Alert severity="info" sx={{ mb: 4 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                    Price Range Symbols:
                </Typography>
                <Box display="flex" gap={3} flexWrap="wrap">
                    <Typography variant="body2">€ = Cheap</Typography>
                    <Typography variant="body2">€€ = Regular</Typography>
                    <Typography variant="body2">€€€ = Expensive</Typography>
                    <Typography variant="body2">€€€€ = Premium</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Historical price range classifications update automatically when you adjust price bands!
                </Typography>
            </Alert>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <FormControl fullWidth>
                        <InputLabel>Select Restaurant</InputLabel>
                        <Select
                            value={selectedRestaurantId || ""}
                            onChange={(e) => handleRestaurantChange(e.target.value)}
                            label="Select Restaurant"
                            disabled={loadingRestaurants}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {restaurants?.map((restaurant) => {
                                const id = restaurantId(restaurant);
                                return (
                                    <MenuItem key={id} value={id || ""}>
                                        {restaurant.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {selectedRestaurantId && (
                <>
                    {loadingSnapshots ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">Failed to load price snapshots</Alert>
                    ) : !snapshots || snapshots.length === 0 ? (
                        <Alert severity="info">
                            No price evolution data available for this restaurant yet.
                        </Alert>
                    ) : (
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontWeight={700}>
                                    Price Range Evolution Over Time
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    {snapshots.length} price range change{snapshots.length !== 1 ? "s" : ""}{" "}
                                    recorded
                                </Typography>

                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={600}>
                                        <LineChart
                                            data={chartData}
                                            margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                            />
                                            <YAxis
                                                label={{
                                                    value: 'Price Range',
                                                    angle: -90,
                                                    position: 'insideLeft',
                                                    offset: 10
                                                }}
                                                domain={[0, 5]}
                                                ticks={[1, 2, 3, 4]}
                                                width={80}
                                                tickFormatter={(value) => {
                                                    switch (value) {
                                                        case 1: return '€';
                                                        case 2: return '€€';
                                                        case 3: return '€€€';
                                                        case 4: return '€€€€';
                                                        default: return '';
                                                    }
                                                }}
                                            />
                                            <Tooltip
                                                formatter={(value: number, name, props) => {
                                                    const symbol = props.payload.tierSymbol || "";
                                                    return [symbol, "Price Range"];
                                                }}
                                                labelFormatter={(label, payload) => {
                                                    if (payload && payload[0]) {
                                                        return `${payload[0].payload.date} ${payload[0].payload.time}`;
                                                    }
                                                    return label;
                                                }}
                                            />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} />

                                            <Line
                                                type="monotone"
                                                dataKey="tierValue"
                                                stroke="#ff9800"
                                                strokeWidth={3}
                                                name="Price Range Evolution"
                                                dot={{ r: 6 }}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        No chart data available. Snapshots exist but chart data could not be generated.
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </Container>
    );
}
