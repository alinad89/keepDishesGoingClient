import { Card, CardContent, CardActions, Typography, Button, Stack, Chip, Divider, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type { IncomingOrderResponse } from "../../types";
import OrderItemsDisplay from "./OrderItemsDisplay";
import OrderDeadlineTimer from "./OrderDeadlineTimer";

type PendingOrderCardProps = {
    order: IncomingOrderResponse;
    onAccept: (orderId: string, restaurantId: string) => void;
    onDecline: (orderId: string, restaurantId: string) => void;
    isAccepting?: boolean;
    isDeclining?: boolean;
};

export default function PendingOrderCard({
                                             order,
                                             onAccept,
                                             onDecline,
                                             isAccepting = false,
                                             isDeclining = false,
                                         }: PendingOrderCardProps) {
    const { orderId, restaurantId, status, orderItems, dropoffAddress, decisionDeadline } = order;

    return (
        <Card variant="outlined" sx={{ borderRadius: 2, borderWidth: 2, borderColor: "warning.main" }}>
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={700}>
                            Order #{orderId.slice(0, 8)}
                        </Typography>
                        {dropoffAddress && (
                            <Typography variant="body2" color="text.secondary">
                                Deliver to: {dropoffAddress.street} {dropoffAddress.number}, {dropoffAddress.city}
                            </Typography>
                        )}
                        {decisionDeadline && (
                            <Box sx={{ mt: 1 }}>
                                <OrderDeadlineTimer decisionDeadline={decisionDeadline} />
                            </Box>
                        )}
                    </Box>
                    <Chip label={status} color="warning" size="small" />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Order Items
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <OrderItemsDisplay items={orderItems} />
                </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, gap: 1 }}>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => onAccept(orderId, restaurantId)}
                    disabled={isAccepting || isDeclining}
                    fullWidth
                >
                    {isAccepting ? "Accepting..." : "Accept Order"}
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => onDecline(orderId, restaurantId)}
                    disabled={isAccepting || isDeclining}
                    fullWidth
                >
                    {isDeclining ? "Declining..." : "Decline"}
                </Button>
            </CardActions>
        </Card>
    );
}
