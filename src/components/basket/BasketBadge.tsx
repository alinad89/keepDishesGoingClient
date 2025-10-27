import { Badge, IconButton, Tooltip } from "@mui/material";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { useBasket } from "../../hooks/customer/useBasket.ts";

export default function BasketBadge() {
    const { basket } = useBasket();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    const count =
        basket?.items?.reduce((acc: number, it: any) => acc + (it.quantity ?? 0), 0) ?? 0;

    const goCheckout = () => {
        // preserve current restaurant context if present
        const params = new URLSearchParams(search);
        const restaurant = params.get("restaurant")
            || localStorage.getItem("lastRestaurantId")
            || undefined;

        navigate(
            restaurant
                ? `/customer/checkout?restaurant=${restaurant}`
                : "/customer/checkout",
            { state: { from: pathname } }
        );
    };

    return (
        <Tooltip title="Basket">
            <IconButton color="inherit" onClick={goCheckout} aria-label="Open basket">
                <Badge badgeContent={count} color="primary" showZero max={99}>
                    <ShoppingCartOutlined />
                </Badge>
            </IconButton>
        </Tooltip>
    );
}
