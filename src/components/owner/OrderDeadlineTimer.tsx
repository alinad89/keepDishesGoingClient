import { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";

type OrderDeadlineTimerProps = {
    decisionDeadline: string | null | undefined;
};

export default function OrderDeadlineTimer({ decisionDeadline }: OrderDeadlineTimerProps) {
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

    useEffect(() => {
        if (!decisionDeadline) {
            setTimeRemaining(null);
            return;
        }

        const calculateTimeRemaining = () => {
            const deadline = new Date(decisionDeadline).getTime();
            const now = Date.now();
            const remaining = Math.max(0, deadline - now);
            setTimeRemaining(remaining);
        };

        // Calculate immediately
        calculateTimeRemaining();

        // Update every second
        const interval = setInterval(calculateTimeRemaining, 1000);

        return () => clearInterval(interval);
    }, [decisionDeadline]);

    if (timeRemaining === null) {
        return null;
    }

    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);

    // Determine urgency level
    const isExpired = timeRemaining === 0;
    const isUrgent = timeRemaining < 60000; // Less than 1 minute
    const isWarning = timeRemaining < 120000; // Less than 2 minutes

    if (isExpired) {
        return (
            <Chip
                icon={<WarningIcon />}
                label="Deadline passed - auto-declining"
                color="error"
                size="small"
                sx={{ fontWeight: 600 }}
            />
        );
    }

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon
                fontSize="small"
                sx={{
                    color: isUrgent ? "error.main" : isWarning ? "warning.main" : "text.secondary",
                }}
            />
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 600,
                    color: isUrgent ? "error.main" : isWarning ? "warning.main" : "text.secondary",
                }}
            >
                {minutes}:{seconds.toString().padStart(2, "0")} left
            </Typography>
        </Box>
    );
}
