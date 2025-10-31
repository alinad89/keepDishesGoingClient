// src/pages/owner/EditDishDraftPage.tsx
import { Container, Typography, Button, Stack, CircularProgress, Alert } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
    fetchOwnerDishes,
    applyDishDraft,
} from "../../services/owner/dishService";
import type { DishDto, EditDishDraftRequest, DishDraft } from "../../types";
import DishFormFields from "../../components/owner/DishFormFields";
import { useDishDraft } from "../../hooks/owner/useDishDraft";

export default function EditDishDraftPage() {
    /** Router + libs (hooks FIRST, never behind conditionals) */
    const { dishId } = useParams<{ dishId: string }>();
    const navigate = useNavigate();
    const qc = useQueryClient();

    /** UI state */
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    /** Get draft hooks */
    const { updateDishDraft } = useDishDraft();

    /** Load owner dishes so we can pick the one to edit */
    const { data: dishes, isLoading, isError } = useQuery<DishDto[]>({
        queryKey: ["owner", "dishes"],
        queryFn: fetchOwnerDishes,
        staleTime: 15_000,
    });

    /** Pick the dish by id from cache/result */
    const dish = dishes?.find((d) => d.id === dishId);

    /** Current draft (if any) */
    const draft: DishDraft | null | undefined = dish?.draft;

    /** Form */
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = useForm<EditDishDraftRequest>({
        defaultValues: { name: "", description: "", price: 0, pictureUrl: "" },
    });

    /** Seed form when dish/draft changes */
    useEffect(() => {
        if (!dish) return;
        reset({
            name: (draft?.name ?? dish.name) || "",
            description: (draft?.description ?? dish.description) || "",
            price:
                typeof draft?.price === "number"
                    ? draft.price
                    : typeof dish.price === "number"
                        ? dish.price
                        : 0,
            pictureUrl: (draft?.pictureUrl ?? dish.pictureUrl) || "",
        });
    }, [dish, draft, reset]);

    /** Apply draft (PATCH /menus/dishes/:id/draft) */
    const applyDraftMut = useMutation({
        mutationFn: () => applyDishDraft(dishId!),
        onMutate: async () => {
            setErrorMsg(null);
            setSuccessMsg(null);
        },
        onError: (err: any) => {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Failed to apply draft";
            setErrorMsg(msg);
        },
        onSuccess: async (updatedDish) => {
            console.log("[EditDishDraftPage] Draft applied successfully:", updatedDish);
            await qc.invalidateQueries({ queryKey: ["owner", "dishes"] });
            await qc.refetchQueries({ queryKey: ["owner", "dishes"] });
            setSuccessMsg("Draft applied successfully! Redirecting...");
            setTimeout(() => navigate("/owner/dishes"), 1500);
        },
    });

    /** Submit handler */
    const onSubmit = handleSubmit(async (values) => {
        if (!dish || !dishId) return;
        setErrorMsg(null);
        setSuccessMsg(null);

        const body: EditDishDraftRequest = {
            name: values.name || "",
            description: values.description || null,
            price: typeof values.price === "number" ? values.price : Number(values.price ?? 0),
            pictureUrl: values.pictureUrl || null,
            type: (draft?.type ?? dish.type) as DishDto["type"],
            tags: (draft?.tags ?? dish.tags ?? []) as string[],
        };

        console.log("[EditDishDraftPage] Submitting draft:", body);

        updateDishDraft.mutate(
            { dishId, body },
            {
                onSuccess: async (updatedDish) => {
                    console.log("[EditDishDraftPage] Draft saved, response:", updatedDish);
                    console.log("[EditDishDraftPage] Response has draft?", !!updatedDish.draft);

                    // Invalidate and refetch to get the latest data
                    await qc.invalidateQueries({ queryKey: ["owner", "dishes"] });
                    await qc.refetchQueries({ queryKey: ["owner", "dishes"] });

                    setSuccessMsg("Draft saved successfully!");
                    setTimeout(() => setSuccessMsg(null), 3000);
                },
                onError: (err: any) => {
                    console.error("[EditDishDraftPage] Save failed:", err);
                    const msg =
                        err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        err?.message ||
                        "Failed to save draft";
                    setErrorMsg(msg);
                },
            }
        );
    });

    /** Derived UI flags */
    const saving = isSubmitting || updateDishDraft.isPending;
    const hasDraft = Boolean(draft);

    /** Render (no early returns before hooks!) */
    if (!dishId) {
        return (
            <Container sx={{ py: 8, textAlign: "center" }}>
                <Typography color="error">Invalid dish ID</Typography>
            </Container>
        );
    }

    if (isLoading || !dishes) {
        return (
            <Container sx={{ py: 8, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading dish...</Typography>
            </Container>
        );
    }

    if (isError || !dish) {
        return (
            <Container sx={{ py: 8, textAlign: "center" }}>
                <Typography color="error">Failed to load dish.</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 6, maxWidth: 640 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Edit Dish Draft
            </Typography>

            {errorMsg && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMsg}
                </Alert>
            )}

            {successMsg && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMsg}
                </Alert>
            )}

            <form onSubmit={onSubmit} noValidate>
                <DishFormFields register={register} errors={errors} />

                <Stack direction="row" spacing={2} mt={3} flexWrap="wrap">
                    <Button type="submit" variant="contained" color="success" disabled={saving}>
                        {saving ? "Saving..." : "Save Draft"}
                    </Button>

                    <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={() => applyDraftMut.mutate()}
                        disabled={applyDraftMut.isPending || !hasDraft}
                    >
                        {applyDraftMut.isPending ? "Applying..." : "Apply Draft"}
                    </Button>

                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate("/owner/dishes")}
                        disabled={saving || applyDraftMut.isPending}
                    >
                        ← Back to Dishes
                    </Button>
                </Stack>
            </form>
        </Container>
    );
}
