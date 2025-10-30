import { Box, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../lib/axiosClient";
import type { UUID, DishDto } from "../../types";

type OrderItemsDisplayProps = {
    items: Array<{ dishId: UUID; quantity: number }>;
};

async function fetchDish(dishId: UUID): Promise<DishDto> {
    const { data } = await axiosClient.get(`/dishes/${dishId}`);
    return data;
}

function OrderItemRow({ dishId, quantity }: { dishId: UUID; quantity: number }) {
    const { data: dish, isLoading, isError } = useQuery({
        queryKey: ["dishes", dishId],
        queryFn: () => fetchDish(dishId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false, // Don't retry on 405
    });

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                    Loading dish info...
                </Typography>
            </Box>
        );
    }

    // If dish endpoint doesn't exist, just show ID
    const dishName = dish?.name || (isError ? `Dish ${dishId.slice(0, 8)}` : `Dish ${dishId.slice(0, 8)}`);
    const price = dish?.price ? `€${(dish.price * quantity).toFixed(2)}` : "";

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2">
                {quantity}× {dishName}
            </Typography>
            {price && (
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                    {price}
                </Typography>
            )}
        </Box>
    );
}

export default function OrderItemsDisplay({ items }: OrderItemsDisplayProps) {
    return (
        <Box>
            {items.map((item, index) => (
                <OrderItemRow key={index} dishId={item.dishId} quantity={item.quantity} />
            ))}
        </Box>
    );
}
