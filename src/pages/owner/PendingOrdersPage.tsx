// src/pages/owner/PendingOrdersPage.tsx
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Stack,
    Box,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField
} from "@mui/material";
import { useState } from "react";
import { usePendingOrders, useAcceptOrder, useDeclineOrder } from "../../hooks/owner/useOrderManagement";
import PendingOrderCard from "../../components/owner/PendingOrderCard";
import { useMyRestaurant } from "../../hooks/owner/useOwner";
import { restaurantId } from "../../types";

export default function PendingOrdersPage() {
    const { data: restaurant } = useMyRestaurant();
    const { data: orders, isLoading, isError } = usePendingOrders(restaurantId(restaurant) ?? undefined);
    const acceptMutation = useAcceptOrder();
    const declineMutation = useDeclineOrder();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
    const [orderToDecline, setOrderToDecline] = useState<{ orderId: string; restaurantId: string } | null>(null);
    const [declineReason, setDeclineReason] = useState<string>("");

    const handleAccept = (orderId: string, restaurantId: string) => {
        acceptMutation.mutate(
            { restaurantId, orderId },
            {
                onSuccess: () => {
                    setSuccessMessage(`Order #${orderId.slice(0, 8)} accepted successfully!`);
                },
                onError: (error: any) => {
                    const backendError = error?.response?.data?.message ||
                                        error?.response?.data?.error ||
                                        error?.message ||
                                        "Failed to accept order";
                    setErrorMessage(`Accept failed: ${backendError}`);
                }
            }
        );
    };

    const handleDecline = (orderId: string, restaurantId: string) => {
        // Show confirmation dialog
        setOrderToDecline({ orderId, restaurantId });
        setDeclineReason(""); // Reset reason
        setDeclineDialogOpen(true);
    };

    const confirmDecline = () => {
        if (!orderToDecline) return;

        // Validate reason
        if (!declineReason.trim()) {
            setErrorMessage("Please provide a reason for declining the order");
            return;
        }

        declineMutation.mutate(
            { ...orderToDecline, reason: declineReason },
            {
                onSuccess: () => {
                    setSuccessMessage(`Order #${orderToDecline.orderId.slice(0, 8)} declined successfully!`);
                    setDeclineDialogOpen(false);
                    setOrderToDecline(null);
                    setDeclineReason("");
                },
                onError: (error: any) => {
                    const backendError = error?.response?.data?.message ||
                                        error?.response?.data?.error ||
                                        error?.message ||
                                        "Failed to decline order";
                    setErrorMessage(`Decline failed: ${backendError}`);
                    setDeclineDialogOpen(false);
                    setOrderToDecline(null);
                    setDeclineReason("");
                }
            }
        );
    };

    const cancelDecline = () => {
        setDeclineDialogOpen(false);
        setOrderToDecline(null);
        setDeclineReason("");
    };

    if (isLoading) {
        return (
            <Container sx={{ py: 8, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading pending orders...</Typography>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error">Failed to load pending orders</Alert>
            </Container>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Pending Orders
                </Typography>
                <Alert severity="info">No pending orders at the moment</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Pending Orders
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {orders.length} {orders.length === 1 ? "order" : "orders"} waiting for your response
                </Typography>
            </Box>

            <Stack spacing={3}>
                {orders.map((order) => (
                    <PendingOrderCard
                        key={order.orderId}
                        order={order}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        isAccepting={acceptMutation.isPending}
                        isDeclining={declineMutation.isPending}
                    />
                ))}
            </Stack>

            {/* Decline Confirmation Dialog */}
            <Dialog
                open={declineDialogOpen}
                onClose={cancelDecline}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Decline Order?</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Are you sure you want to decline order #{orderToDecline?.orderId.slice(0, 8)}?
                        This action cannot be undone and the customer will be notified.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        fullWidth
                        multiline
                        rows={3}
                        label="Reason for declining *"
                        placeholder="E.g., Out of ingredients, Restaurant closing early, etc."
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        variant="outlined"
                        required
                        helperText="Please explain why you're declining this order"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDecline} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDecline}
                        color="error"
                        variant="contained"
                        disabled={declineMutation.isPending || !declineReason.trim()}
                    >
                        {declineMutation.isPending ? "Declining..." : "Decline Order"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error notification */}
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage("")}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            {/* Success notification */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage("")}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}
