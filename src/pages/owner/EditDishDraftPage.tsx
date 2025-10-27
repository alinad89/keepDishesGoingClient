// src/pages/owner/EditDishDraftPage.tsx
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
    CircularProgress,
} from "@mui/material";

import { useDishDraft } from "../../hooks/owner/useDishDraft";
import { fetchOwnerDishes } from "../../services/owner/dishService";

export default function EditDishDraftPage() {
    const { dishId } = useParams<{ dishId: string }>();
    const { updateDishDraft, applyDrafts } = useDishDraft();
    const navigate = useNavigate();

    const [dish, setDish] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // ✅ Load existing dish data
    useEffect(() => {
        const loadDish = async () => {
            try {
                const dishes = await fetchOwnerDishes();
                const found = dishes.find((d) => d.id === dishId);
                setDish(found);
            } catch (err) {
                console.error("Failed to fetch dish:", err);
            } finally {
                setLoading(false);
            }
        };
        loadDish();
    }, [dishId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDish({ ...dish, [e.target.name]: e.target.value });
    };

    const handleSaveDraft = () => {
        if (!dishId || !dish) return;
        updateDishDraft.mutate(
            { dishId, body: dish },
            {
                onSuccess: () => {
                    navigate("/owner/dishes");
                },
                onError: () => {
                    alert("❌ Failed to save draft. Please try again.");
                },
            }
        );
    };

    const handleApplyAll = () => {
        applyDrafts.mutate(undefined, {
            onSuccess: () => {
                navigate("/owner/dishes");
            },
            onError: () => {
                alert("❌ Failed to apply drafts.");
            },
        });
    };

    if (loading)
        return (
            <Stack alignItems="center" sx={{ mt: 10 }}>
                <CircularProgress />
            </Stack>
        );

    if (!dish)
        return (
            <Typography sx={{ mt: 5, textAlign: "center" }}>
                Dish not found.
            </Typography>
        );

    return (
        <Paper sx={{ p: 4, mt: 4, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h5" gutterBottom>
                Edit Dish Draft
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Name"
                    name="name"
                    value={dish.name || ""}
                    onChange={handleChange}
                />
                <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={3}
                    value={dish.description || ""}
                    onChange={handleChange}
                />
                <TextField
                    label="Price (€)"
                    name="price"
                    type="number"
                    value={dish.price || ""}
                    onChange={handleChange}
                />
                <TextField
                    label="Picture URL"
                    name="pictureUrl"
                    value={dish.pictureUrl || ""}
                    onChange={handleChange}
                />

                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveDraft}
                        disabled={updateDishDraft.isPending}
                    >
                        {updateDishDraft.isPending ? "Saving..." : "Save Draft"}
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleApplyAll}
                        disabled={applyDrafts.isPending}
                    >
                        {applyDrafts.isPending ? "Applying..." : "Apply Draft"}
                    </Button>

                    <Button
                        component={RouterLink}
                        to="/owner/dishes"
                        variant="outlined"
                    >
                        ← Back to Dishes
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}
