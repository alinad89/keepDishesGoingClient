import { Card, CardContent, CardActions, Typography, Button, Stack, Chip, Divider, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { IncomingOrderResponse } from "../../types";
import OrderItemsDisplay from "./OrderItemsDisplay";

type AcceptedOrderCardProps = {
    order: IncomingOrderResponse;
    onMarkReady: (orderId: string, restaurantId: string) => void;
    isMarking?: boolean;
};

export default function AcceptedOrderCard({
    order,
    onMarkReady,
    isMarking = false,
}: AcceptedOrderCardProps) {
    const { orderId, restaurantId, status, orderItems, dropoffAddress } = order;

    return (
        <Card variant="outlined" sx={{ borderRadius: 2, borderWidth: 2, borderColor: "success.main" }}>
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            Order #{orderId.slice(0, 8)}
                        </Typography>
                        {dropoffAddress && (
                            <Typography variant="body2" color="text.secondary">
                                Deliver to: {dropoffAddress.street} {dropoffAddress.number}, {dropoffAddress.city}
                            </Typography>
                        )}
                    </Box>
                    <Chip label={status} color="success" size="small" />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Order Items
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <OrderItemsDisplay items={orderItems} />
                </Stack>
            </CardContent>

            <CardActions sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => onMarkReady(orderId, restaurantId)}
                    disabled={isMarking}
                    fullWidth
                >
                    {isMarking ? "Marking Ready..." : "Mark Ready for Pickup"}
                </Button>
            </CardActions>
        </Card>
    );
}
