import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Stack,
    Chip,
    CircularProgress,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOwnerDishes, changeDishStatus } from "../../services/owner/dishService.ts";
import type { DishDto, DishState } from "../../types";
import { Link as RouterLink } from "react-router-dom";


export default function OwnerDishesPage() {
    const qc = useQueryClient();

    const {
        data: dishes,
        isLoading,
        isError,
    } = useQuery<DishDto[]>({
        queryKey: ["owner", "dishes"],
        queryFn: fetchOwnerDishes,
    });

    const handleChange = async (dishId: string, newState: DishState) => {
        try {
            await changeDishStatus(dishId, { dishState: newState });
            await qc.invalidateQueries({ queryKey: ["owner", "dishes"] });
        } catch (err) {
            console.error("Failed to update dish status", err);
        }
    };

    const colorForState = (state?: DishState) => {
        switch (state) {
            case "PUBLISHED":
                return "success";
            case "OUT_OF_STOCK":
                return "warning";
            case "UNPUBLISHED":
                return "default";
            default:
                return "default";
        }
    };

    if (isLoading)
        return (
            <Container sx={{ py: 8, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading dishes...</Typography>
            </Container>
        );

    if (isError)
        return (
            <Container sx={{ py: 8 }}>
                <Typography color="error" align="center">
                    Failed to load dishes.
                </Typography>
            </Container>
        );

    if (!dishes?.length)
        return (
            <Container sx={{ py: 8 }}>
                <Typography align="center">No dishes found.</Typography>
            </Container>
        );

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
                Manage Dishes
            </Typography>

            <Stack spacing={2}>
                {dishes.map((d) => (
                    <Card key={d.id} variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{d.name}</Typography>
                            <Typography color="text.secondary" sx={{ mb: 1 }}>
                                €{d.price.toFixed(2)}
                            </Typography>
                            <Chip
                                label={d.state ?? "UNPUBLISHED"}
                                color={colorForState(d.state)}
                            />
                        </CardContent>

                        <CardActions sx={{ gap: 1, pl: 2, pb: 2 }}>
                            <Button
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={() => handleChange(d.id, "PUBLISHED")}
                            >
                                Publish
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleChange(d.id, "UNPUBLISHED")}
                            >
                                Unpublish
                            </Button>
                            <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                onClick={() => handleChange(d.id, "OUT_OF_STOCK")}
                            >
                                Out of stock
                            </Button>


                            <Button
                                component={RouterLink}
                                to={`/owner/dishes/${d.id}/edit-draft`}
                                variant="outlined"
                                color="primary"
                                size="small"
                            >
                                Edit Draft
                            </Button>
                        </CardActions>

                    </Card>
                ))}
            </Stack>
        </Container>
    );
}
