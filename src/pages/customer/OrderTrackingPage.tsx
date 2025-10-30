// src/pages/customer/OrderTrackingPage.tsx
import { Container, Typography, CircularProgress, Alert, Box, Paper, Stack, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import { useOrderTracking } from "../../hooks/customer/useOrderTracking";
import OrderStatusStepper from "../../components/customer/OrderStatusStepper";
import DeliveryLocationCard from "../../components/customer/DeliveryLocationCard";

export default function OrderTrackingPage() {
    const { orderId } = useParams<{ orderId: string }>();

    const { data: order, isLoading, isError } = useOrderTracking(orderId!);

    if (!orderId) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error">Invalid order ID</Alert>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container sx={{ py: 8, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading order details...</Typography>
            </Container>
        );
    }

    if (isError || !order) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error">Failed to load order details</Alert>
            </Container>
        );
    }

    // Debug: Check if location data exists
    console.log('[OrderTrackingPage] Order has location?', {
        orderId: order.orderId,
        status: order.status,
        hasLat: order.lat != null,
        hasLng: order.lng != null,
        lat: order.lat,
        lng: order.lng
    });

    return (
        <Container sx={{ py: 4, maxWidth: 800 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Track Your Order
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Order ID: {order.orderId}
            </Typography>

            <Box sx={{ mt: 3, mb: 3 }}>
                <OrderStatusStepper currentStatus={order.status} />
            </Box>

            {/* Show delivery location if available (during PICKED_UP or DELIVERED) */}
            {order.lat != null && order.lng != null && (
                <Box sx={{ mb: 3 }}>
                    <DeliveryLocationCard lat={order.lat} lng={order.lng} />
                </Box>
            )}

            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Order Details
                </Typography>

                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Items
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    {order.items.map((item, index) => (
                        <Box key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2">
                                {item.quantity}x {item.dishName}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                €{(item.quantity * item.unitPrice).toFixed(2)}
                            </Typography>
                        </Box>
                    ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight={700}>
                        Total
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="primary">
                        €{order.totalPrice.toFixed(2)}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}
