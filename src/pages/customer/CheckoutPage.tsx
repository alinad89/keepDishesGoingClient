// src/pages/customer/CheckoutPage.tsx
import { useMemo } from "react";
import { Container, Typography, Button } from "@mui/material";
import { useBasket } from "../../hooks/customer/useBasket";
import BasketInfo from "../../components/basket/BasketInfo.tsx";
import BasketLoading from "../../components/basket/BasketLoading.tsx";
import BasketEmpty from "../../components/basket/BasketEmpty.tsx";
import { BasketItemList } from "../../components/basket/BasketItemList.tsx";
import { useOrder } from "../../hooks/customer/useOrder.ts"; // ✅ new hook

export default function CheckoutPage() {
    const restaurantId =
        new URLSearchParams(window.location.search).get("restaurant") ||
        localStorage.getItem("lastRestaurantId") ||
        "";

    const { basket, isBasketLoading } = useBasket();
    const { startCheckout, isPending } = useOrder(); // ✅ from your hook

    const items = basket?.items ?? [];

    const total = useMemo(
        () =>
            basket?.totalPrice ??
            items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0),
        [basket?.totalPrice, items]
    );

    const isEmpty = !items.length;

    // ✅ Trigger backend → Stripe checkout
    const handleCheckout = () => {
        if (!restaurantId) return;
        startCheckout(restaurantId, {
            onSuccess: (url) => {
                window.location.href = url; // redirect to Stripe checkout
            },
            onError: () => {
                alert("Failed to start checkout. Please try again.");
            },
        });
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
                    <BasketItemList items={items} totalPrice={total} />

                    {/* ✅ Checkout button */}
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 3 }}
                        onClick={handleCheckout}
                        disabled={isPending}
                    >
                        {isPending ? "Processing..." : "Proceed to Payment"}
                    </Button>
                </>
            )}
        </Container>
    );
}
