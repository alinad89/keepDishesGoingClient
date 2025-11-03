// src/pages/customer/CheckoutPage.tsx
import { Container, Typography, Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBasket } from "../../hooks/customer/useBasket";
import BasketInfo from "../../components/basket/BasketInfo";
import BasketLoading from "../../components/basket/BasketLoading";
import BasketEmpty from "../../components/basket/BasketEmpty";
import { BasketItemList } from "../../components/basket/BasketItemList";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const restaurantId =
        searchParams.get("restaurant") ||
        localStorage.getItem("lastRestaurantId") ||
        "";

    const { basket, isBasketLoading } = useBasket();
    const availableItems = basket?.availableItems ?? [];
    const blockedItems = basket?.blockedItems ?? [];
    const total = basket?.totalPrice ?? 0;
    const isBlocked = basket?.blocked ?? false;

    const isEmpty = availableItems.length === 0 && blockedItems.length === 0;

    const handleGoToForm = () => {
        if (!restaurantId) return;
        if (isBlocked) return; // Prevent checkout if basket is blocked
        navigate(`/customer/checkout/info?restaurant=${restaurantId}`);
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Basket
            </Typography>

            <BasketInfo show={!restaurantId} />
            {isBasketLoading && <BasketLoading />}
            {!isBasketLoading && isEmpty && <BasketEmpty />}

            {!isBasketLoading && !isEmpty && (
                <>
                    <BasketItemList
                        availableItems={availableItems}
                        blockedItems={blockedItems}
                        totalPrice={total}
                    />

                    {/* ✅ This button now redirects instead of submitting */}
                    <Button
                        variant="contained"
                        color={isBlocked ? "error" : "success"}
                        sx={{ mt: 3 }}
                        onClick={handleGoToForm}
                        disabled={isBlocked || availableItems.length === 0}
                    >
                        {isBlocked ? "Cannot Checkout - Items Unavailable" : "Proceed to Checkout"}
                    </Button>
                </>
            )}
        </Container>
    );
}
