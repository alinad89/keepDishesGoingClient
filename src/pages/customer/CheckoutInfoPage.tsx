import { Container, Typography, Alert, CircularProgress, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useOrder } from "../../hooks/customer/useOrder";
import { getAnonId } from "../../services/customer/customerService";
import CustomerInfoForm, { type CustomerInfo } from "../../components/checkout/CustomerInfoForm";

export default function CheckoutInfoPage() {
    const [searchParams] = useSearchParams();
    const restaurantId = searchParams.get("restaurant");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [anonIdReady, setAnonIdReady] = useState(false);

    const { startCheckout, isPending, error } = useOrder();

    // Ensure anonymous customer ID is set before allowing checkout
    useEffect(() => {
        getAnonId().then((id) => {
            console.log("=== ANONYMOUS CUSTOMER ID ===");
            console.log("ID:", id);
            setAnonIdReady(true);
        }).catch((err) => {
            console.error("Failed to get anonymous customer ID:", err);
            setErrorMessage("Failed to initialize customer session. Please refresh the page.");
        });
    }, []);

    const handleCheckout = (data: CustomerInfo) => {
        setErrorMessage("");

        if (!restaurantId) {
            setErrorMessage("Missing restaurant ID. Please go back and select a restaurant.");
            return;
        }

        if (!anonIdReady) {
            setErrorMessage("Customer session not ready. Please try again.");
            return;
        }

        console.log("=== USER SUBMITTED FORM ===");
        console.log("Form data:", data);

        startCheckout(restaurantId, data, {
            onSuccess: (url) => {
                console.log("=== REDIRECTING TO PAYMENT ===");
                console.log("Payment URL:", url);
                window.location.href = url;
            },
            onError: (err) => {
                console.error("=== CHECKOUT FAILED ===");
                console.error("Error details:", err);

                let message = "Failed to start checkout. Please try again.";
                if (err instanceof Error) {
                    message = err.message;
                } else if (typeof err === "string") {
                    message = err;
                }
                setErrorMessage(message);
            },
        });
    };

    if (!restaurantId) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error">
                    No restaurant ID found. Please select a restaurant first.
                </Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Delivery Information
            </Typography>

            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error: {error instanceof Error ? error.message : "Unknown error occurred"}
                </Alert>
            )}

            {!anonIdReady && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <CircularProgress size={24} />
                    <Typography>Initializing customer session...</Typography>
                </Box>
            )}

            {isPending && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <CircularProgress size={24} />
                    <Typography>Processing your order...</Typography>
                </Box>
            )}

            <CustomerInfoForm onSubmit={handleCheckout} disabled={isPending || !anonIdReady} />
        </Container>
    );
}
