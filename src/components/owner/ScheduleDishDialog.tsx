import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Alert } from "@mui/material";
import { useState } from "react";
import type { DishDto } from "../../types";

type ScheduleDishDialogProps = {
    dish: DishDto | null;
    open: boolean;
    onClose: () => void;
    onSchedule: (dishId: string, publishAt: string | null, unpublishAt: string | null) => void;
    isSubmitting?: boolean;
};

export default function ScheduleDishDialog({
    dish,
    open,
    onClose,
    onSchedule,
    isSubmitting = false,
}: ScheduleDishDialogProps) {
    const [publishAt, setPublishAt] = useState<string>("");
    const [unpublishAt, setUnpublishAt] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!dish) return;

        // Convert datetime-local to ISO-8601 format
        const publishAtISO = publishAt ? new Date(publishAt).toISOString() : null;
        const unpublishAtISO = unpublishAt ? new Date(unpublishAt).toISOString() : null;

        onSchedule(dish.id, publishAtISO, unpublishAtISO);

        // Reset and close
        setPublishAt("");
        setUnpublishAt("");
        onClose();
    };

    const handleClose = () => {
        setPublishAt("");
        setUnpublishAt("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    Schedule: {dish?.name}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Alert severity="info">
                            Set when this dish should be automatically published and/or unpublished. Leave blank to skip.
                        </Alert>

                        <TextField
                            label="Publish At"
                            type="datetime-local"
                            value={publishAt}
                            onChange={(e) => setPublishAt(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />

                        <TextField
                            label="Unpublish At"
                            type="datetime-local"
                            value={unpublishAt}
                            onChange={(e) => setUnpublishAt(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || (!publishAt && !unpublishAt)}
                    >
                        {isSubmitting ? "Scheduling..." : "Schedule"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
