import { Box, Button, Card, CardContent, Typography, Switch, FormControlLabel, Alert } from "@mui/material";
import { useState } from "react";
import { useSetManualOpen } from "../../hooks/owner/useOwner";
import { useQueryClient } from "@tanstack/react-query";

type RestaurantOpeningControlProps = {
    restaurantId: string;
    currentlyOpen?: boolean;
    manualControl?: boolean;
};

export default function RestaurantOpeningControl({
    restaurantId: _restaurantId,
    currentlyOpen = false,
    manualControl = false,
}: RestaurantOpeningControlProps) {
    const [isOpen, setIsOpen] = useState(currentlyOpen);
    const [hasManualControl, setHasManualControl] = useState(manualControl);
    const setManualOpenMutation = useSetManualOpen();
    const qc = useQueryClient();

    const handleToggleOpen = async () => {
        try {
            // Toggle to the opposite state
            await setManualOpenMutation.mutateAsync(!isOpen);
            setIsOpen(!isOpen);
            // Invalidate restaurant query to refetch updated status
            qc.invalidateQueries({ queryKey: ["restaurant", "me"] });
        } catch (error) {
            console.error("Failed to toggle restaurant status:", error);
        }
    };

    return (
        <Card variant="outlined" sx={{ borderRadius: 2, mt: 3 }}>
            <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Restaurant Status
                </Typography>

                <Alert severity={isOpen ? "success" : "warning"} sx={{ mb: 2 }}>
                    Restaurant is currently <strong>{isOpen ? "OPEN" : "CLOSED"}</strong>
                </Alert>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={hasManualControl}
                                onChange={(e) => setHasManualControl(e.target.checked)}
                                disabled
                            />
                        }
                        label="Manual Control (overrides schedule)"
                    />

                    <Button
                        variant="contained"
                        color={isOpen ? "error" : "success"}
                        onClick={handleToggleOpen}
                        disabled={setManualOpenMutation.isPending}
                        fullWidth
                    >
                        {setManualOpenMutation.isPending
                            ? "Updating..."
                            : isOpen
                            ? "Close Restaurant Manually"
                            : "Open Restaurant Manually"}
                    </Button>

                    <Typography variant="caption" color="text.secondary">
                        Manual control allows you to override your scheduled opening hours.
                        Use this for holidays, special events, or emergencies.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
