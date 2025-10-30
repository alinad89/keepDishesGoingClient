// src/pages/owner/AcceptedOrdersPage.tsx
import { Container, Typography, CircularProgress, Alert, Stack, Box } from "@mui/material";
import { useAcceptedOrders, useMarkOrderReady } from "../../hooks/owner/useOrderManagement";
import AcceptedOrderCard from "../../components/owner/AcceptedOrderCard";
import { useMyRestaurant } from "../../hooks/owner/useOwner";
import { restaurantId } from "../../types";

export default function AcceptedOrdersPage() {
    const { data: restaurant } = useMyRestaurant();
    const { data: orders, isLoading, isError } = useAcceptedOrders(restaurantId(restaurant) ?? undefined);
    const markReadyMutation = useMarkOrderReady();

    console.log("[AcceptedOrdersPage] Restaurant data:", restaurant);
    console.log("[AcceptedOrdersPage] Restaurant ID:", restaurantId(restaurant));
    console.log("[AcceptedOrdersPage] Orders:", orders);

    const handleMarkReady = (orderId: string, restaurantId: string) => {
        markReadyMutation.mutate({ restaurantId, orderId });
    };

    if (isLoading) {
        return (
            <Container sx={{ py: 8, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading accepted orders...</Typography>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error">Failed to load accepted orders</Alert>
            </Container>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Accepted Orders
                </Typography>
                <Alert severity="info">No accepted orders at the moment</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Accepted Orders
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {orders.length} {orders.length === 1 ? "order" : "orders"} being prepared
                </Typography>
            </Box>

            <Stack spacing={3}>
                {orders.map((order) => (
                    <AcceptedOrderCard
                        key={order.orderId}
                        order={order}
                        onMarkReady={handleMarkReady}
                        isMarking={markReadyMutation.isPending}
                    />
                ))}
            </Stack>
        </Container>
    );
}
