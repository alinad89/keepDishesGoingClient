// src/components/customer/OrderStatusStepper.tsx
import { Stepper, Step, StepLabel, StepContent, Typography, Box, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CancelIcon from "@mui/icons-material/Cancel";
import type { OrderStatus } from "../../types";

type OrderStatusStepperProps = {
    currentStatus: OrderStatus;
};

const steps = [
    { status: "SUBMITTED", label: "Order Submitted", description: "Your order has been placed" },
    { status: "ACCEPTED", label: "Order Accepted", description: "Restaurant is preparing your food" },
    { status: "READY_FOR_PICKUP", label: "Ready for Pickup", description: "Your order is ready" },
    { status: "PICKED_UP", label: "Picked Up", description: "Delivery driver is on the way" },
    { status: "DELIVERED", label: "Delivered", description: "Order delivered successfully" },
] as const;

function getActiveStep(status: OrderStatus): number {
    if (status === "DECLINED") return -1;
    return steps.findIndex(step => step.status === status);
}

export default function OrderStatusStepper({ currentStatus }: OrderStatusStepperProps) {
    const activeStep = getActiveStep(currentStatus);
    const isDeclined = currentStatus === "DECLINED";

    if (isDeclined) {
        return (
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "error.light" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CancelIcon sx={{ fontSize: 48, color: "error.dark" }} />
                    <Box>
                        <Typography variant="h6" fontWeight={700} color="error.dark">
                            Order Declined
                        </Typography>
                        <Typography color="text.secondary">
                            The restaurant was unable to accept your order. You have not been charged.
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
                Order Progress
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => {
                    const isCompleted = index < activeStep;
                    const isCurrent = index === activeStep;
                    // If we're at the final step (DELIVERED), mark it as completed too
                    const isDeliveredAndFinal = currentStatus === "DELIVERED" && step.status === "DELIVERED";
                    const showAsCompleted = isCompleted || isDeliveredAndFinal;

                    return (
                        <Step key={step.status} completed={showAsCompleted}>
                            <StepLabel
                                StepIconComponent={() => (
                                    showAsCompleted ? (
                                        <CheckCircleIcon sx={{ color: "success.main", fontSize: 32 }} />
                                    ) : isCurrent ? (
                                        <RadioButtonUncheckedIcon sx={{ color: "primary.main", fontSize: 32 }} />
                                    ) : (
                                        <RadioButtonUncheckedIcon sx={{ color: "grey.400", fontSize: 32 }} />
                                    )
                                )}
                            >
                                <Typography
                                    fontWeight={showAsCompleted || isCurrent ? 700 : 400}
                                    color={showAsCompleted ? "success.main" : isCurrent ? "primary" : "text.primary"}
                                >
                                    {step.label}
                                </Typography>
                            </StepLabel>
                            <StepContent>
                                <Typography variant="body2" color="text.secondary">
                                    {step.description}
                                </Typography>
                            </StepContent>
                        </Step>
                    );
                })}
            </Stepper>
        </Paper>
    );
}
