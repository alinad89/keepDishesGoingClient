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
    const items = basket?.items ?? [];

    const total = basket?.totalPrice ??
        items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

    const isEmpty = !items.length;

    const handleGoToForm = () => {
        if (!restaurantId) return;
        // ✅ navigate to form page with restaurantId in query param
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
                    <BasketItemList items={items} totalPrice={total} />

                    {/* ✅ This button now redirects instead of submitting */}
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 3 }}
                        onClick={handleGoToForm}
                    >
                        Proceed to Checkout
                    </Button>
                </>
            )}
        </Container>
    );
}
