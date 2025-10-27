// src/pages/customer/_components/DishGrid.tsx
import { Box, Paper, Skeleton } from "@mui/material";
import DishCard from "./DishCard.tsx";
import type { DishDto } from "../../types"; // ✅ fix path to your shared types

type Props = {
    loading: boolean;
    dishes: DishDto[];
    onAdd: (dishId: string) => void;
    addDisabled?: boolean;
};

export default function DishGrid({ loading, dishes, onAdd, addDisabled }: Props) {
    if (loading) {
        return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Paper key={i} sx={{ p: 2, flex: "1 1 260px", maxWidth: 360 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="90%" />
                        <Skeleton variant="rectangular" height={36} sx={{ mt: 1 }} />
                    </Paper>
                ))}
            </Box>
        );
    }

    // ✅ Only show Published + Out of Stock
    const visibleDishes = dishes.filter(
        (d) => d.state === "PUBLISHED" || d.state === "OUT_OF_STOCK"
    );

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {visibleDishes.map((d) => (
                <DishCard
                    key={d.id}
                    dish={d}
                    onAdd={() => onAdd(d.id)}
                    disabled={addDisabled || d.state === "OUT_OF_STOCK"} // ✅ disable Add button for out of stock
                />
            ))}
        </Box>
    );
}
