// src/pages/customer/CustomerOrdersPage.tsx
import { Container, Typography, CircularProgress, Alert, Stack, Card, CardContent, CardActions, Button, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCustomerOrders } from "../../hooks/customer/useOrderTracking";
import type { OrderStatus } from "../../types";

function getStatusColor(status: OrderStatus): "default" | "warning" | "info" | "success" | "error" {
    switch (status) {
        case "SUBMITTED":
            return "warning";
        case "ACCEPTED":
            return "info";
        case "READY_FOR_PICKUP":
        case "PICKED_UP":
            return "info";
        case "DELIVERED":
            return "success";
        case "DECLINED":
            return "error";
        default:
            return "default";
    }
}

function formatStatus(status: OrderStatus): string {
    return status.replace(/_/g, " ");
}

export default function CustomerOrdersPage() {
    const navigate = useNavigate();
    const { data: orders, isLoading, isError } = useCustomerOrders();

    if (isLoading) {
        return (
            <Container sx={{ py: 8, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading your orders...</Typography>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error">Failed to load your orders</Alert>
            </Container>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    My Orders
                </Typography>
                <Alert severity="info">You haven't placed any orders yet</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                My Orders
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                {orders.length} {orders.length === 1 ? "order" : "orders"}
            </Typography>

            <Stack spacing={2} sx={{ mt: 3 }}>
                {orders.map((order) => {
                    const orderDate = new Date(order.submittedAt).toLocaleDateString();
                    const orderTime = new Date(order.submittedAt).toLocaleTimeString();

                    return (
                        <Card key={order.orderId} variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>
                                            Order #{order.orderId.slice(0, 8)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {orderDate} at {orderTime}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={formatStatus(order.status)}
                                        color={getStatusColor(order.status)}
                                        size="small"
                                    />
                                </Box>

                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700} color="primary">
                                        €{order.totalPrice.toFixed(2)}
                                    </Typography>
                                </Box>
                            </CardContent>

                            <CardActions sx={{ px: 2, pb: 2 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => navigate(`/customer/orders/${order.orderId}`)}
                                >
                                    Track Order
                                </Button>
                            </CardActions>
                        </Card>
                    );
                })}
            </Stack>
        </Container>
    );
}
