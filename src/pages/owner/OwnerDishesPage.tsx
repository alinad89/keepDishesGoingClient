// src/pages/owner/OwnerDishesPage.tsx
import { Container, Typography, Button, Stack, CircularProgress, Box, Alert, Snackbar } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchOwnerDishes, applyAllDishDrafts, applyDishDraft, scheduleDish } from "../../services/owner/dishService.ts";
import type { DishDto } from "../../types";
import { useDishStatusChange } from "../../hooks/owner/useDishStatusChange.ts";
import DishListItem from "../../components/owner/DishListItem.tsx";
import ScheduleDishDialog from "../../components/owner/ScheduleDishDialog.tsx";

export default function OwnerDishesPage() {
    const qc = useQueryClient();
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [selectedDish, setSelectedDish] = useState<DishDto | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const {
        data: dishes,
        isLoading,
        isError,
    } = useQuery<DishDto[]>({
        queryKey: ["owner", "dishes"],
        queryFn: fetchOwnerDishes,
    });

    const applyDraftsMutation = useMutation({
        mutationFn: applyAllDishDrafts,
        onSuccess: (updatedDishes) => {
            qc.setQueryData(["owner", "dishes"], updatedDishes);
            setSuccessMessage("All drafts applied successfully!");
        },
        onError: (error: any) => {
            console.error("Apply all drafts failed:", error);
            setErrorMessage(error?.response?.data?.message || "Failed to apply all drafts");
        },
    });

    const applySingleDraftMutation = useMutation({
        mutationFn: (dishId: string) => applyDishDraft(dishId),
        onSuccess: (updatedDish) => {
            qc.setQueryData<DishDto[]>(["owner", "dishes"], (old) =>
                old?.map((d) => (d.id === updatedDish.id ? updatedDish : d)) ?? []
            );
            setSuccessMessage(`Draft applied for ${updatedDish.name}!`);
        },
        onError: (error: any) => {
            console.error("Apply single draft failed:", error);
            setErrorMessage(error?.response?.data?.message || "Failed to apply draft");
        },
    });

    const scheduleMutation = useMutation({
        mutationFn: ({ dishId, publishAt, unpublishAt }: { dishId: string; publishAt: string | null; unpublishAt: string | null }) =>
            scheduleDish(dishId, { publishAt, unpublishAt }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["owner", "dishes"] });
        },
    });

    const { handleChange } = useDishStatusChange();

    const handleApplyDraft = (dishId: string) => {
        applySingleDraftMutation.mutate(dishId);
    };

    const handleScheduleClick = (dish: DishDto) => {
        setSelectedDish(dish);
        setScheduleDialogOpen(true);
    };

    const handleScheduleSubmit = (dishId: string, publishAt: string | null, unpublishAt: string | null) => {
        scheduleMutation.mutate({ dishId, publishAt, unpublishAt });
    };

    /* ------------------------- Loading / Error states -------------------- */
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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                }}
            >
                <Typography variant="h4" fontWeight={700}>
                    Manage Dishes
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => applyDraftsMutation.mutate()}
                    disabled={applyDraftsMutation.isPending}
                >
                    {applyDraftsMutation.isPending ? "Applying..." : "Apply All Drafts"}
                </Button>
            </Box>

            <Stack spacing={2}>
                {dishes.map((dish) => (
                    <DishListItem
                        key={dish.id}
                        dish={dish}
                        onStatusChange={handleChange}
                        onApplyDraft={handleApplyDraft}
                        onSchedule={handleScheduleClick}
                    />
                ))}
            </Stack>

            <ScheduleDishDialog
                dish={selectedDish}
                open={scheduleDialogOpen}
                onClose={() => setScheduleDialogOpen(false)}
                onSchedule={handleScheduleSubmit}
                isSubmitting={scheduleMutation.isPending}
            />

            {/* Success notification */}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={4000}
                onClose={() => setSuccessMessage("")}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* Error notification */}
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage("")}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}
