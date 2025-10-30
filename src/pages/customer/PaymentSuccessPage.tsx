import { Container, Typography, CircularProgress, Box, Alert, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    const orderId = searchParams.get("orderId") || searchParams.get("order_id");

    useEffect(() => {
        if (!orderId) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(`/customer/orders/${orderId}`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [orderId, navigate]);

    if (!orderId) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="warning">
                    No order ID found. Please check your email for order details or view your orders.
                </Alert>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={() => navigate("/customer/orders")}>
                        View My Orders
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 8, textAlign: "center", maxWidth: 600 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 80, color: "success.main" }} />

                <Typography variant="h4" fontWeight={700} color="success.main">
                    Payment Successful!
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    Thank you for your order. Your payment has been processed successfully.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" color="text.secondary">
                        Redirecting to order tracking in {countdown} seconds...
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    onClick={() => navigate(`/customer/orders/${orderId}`)}
                    sx={{ mt: 2 }}
                >
                    Track Order Now
                </Button>
            </Box>
        </Container>
    );
}
