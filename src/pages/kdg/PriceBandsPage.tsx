// src/pages/kdg/PriceBandsPage.tsx
import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Chip,
    Stack,
} from "@mui/material";
import { usePriceBands, useUpdatePriceBands } from "../../hooks/kdg/usePriceBands";
import type { PriceBands } from "../../types";

export default function PriceBandsPage() {
    const { data: currentBands, isLoading, error } = usePriceBands();
    const { mutate: updateBands, isPending, isSuccess, isError } = useUpdatePriceBands();

    const [cheapMax, setCheapMax] = useState<number>(10);
    const [regularMax, setRegularMax] = useState<number>(30);
    const [expensiveMax, setExpensiveMax] = useState<number>(60);

    useEffect(() => {
        if (currentBands) {
            setCheapMax(currentBands.cheapMax);
            setRegularMax(currentBands.regularMax);
            setExpensiveMax(currentBands.expensiveMax);
        }
    }, [currentBands]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const bands: PriceBands = { cheapMax, regularMax, expensiveMax };
        updateBands(bands);
    };

    const hasChanges =
        currentBands &&
        (cheapMax !== currentBands.cheapMax ||
            regularMax !== currentBands.regularMax ||
            expensiveMax !== currentBands.expensiveMax);

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">Failed to load price bands</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" gutterBottom fontWeight={800}>
                Price Bands Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Define the price thresholds for categorizing restaurants into price ranges
            </Typography>

            {isSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Price bands updated successfully!
                </Alert>
            )}

            {isError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Failed to update price bands. Please try again.
                </Alert>
            )}

            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <Box>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Chip label="CHEAP" color="success" variant="outlined" />
                                    <Typography variant="body2" color="text.secondary">
                                        Dishes from €0 up to this maximum price
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    label="Cheap Maximum (€)"
                                    type="number"
                                    value={cheapMax}
                                    onChange={(e) => setCheapMax(Number(e.target.value))}
                                    inputProps={{ min: 0, step: 0.5 }}
                                    required
                                />
                            </Box>

                            <Box>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Chip label="REGULAR" color="primary" variant="outlined" />
                                    <Typography variant="body2" color="text.secondary">
                                        Dishes from €{cheapMax} up to this maximum price
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    label="Regular Maximum (€)"
                                    type="number"
                                    value={regularMax}
                                    onChange={(e) => setRegularMax(Number(e.target.value))}
                                    inputProps={{ min: cheapMax, step: 0.5 }}
                                    required
                                />
                            </Box>

                            <Box>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Chip label="EXPENSIVE" color="warning" variant="outlined" />
                                    <Typography variant="body2" color="text.secondary">
                                        Dishes from €{regularMax} up to this maximum price
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    label="Expensive Maximum (€)"
                                    type="number"
                                    value={expensiveMax}
                                    onChange={(e) => setExpensiveMax(Number(e.target.value))}
                                    inputProps={{ min: regularMax, step: 0.5 }}
                                    required
                                />
                            </Box>

                            <Box>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Chip label="PREMIUM" color="error" variant="outlined" />
                                    <Typography variant="body2" color="text.secondary">
                                        Dishes above €{expensiveMax}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box display="flex" gap={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={isPending || !hasChanges}
                                    fullWidth
                                >
                                    {isPending ? "Updating..." : "Update Price Bands"}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}
