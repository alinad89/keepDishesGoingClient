// src/components/checkout/CustomerInfoForm.tsx
import { Stack, TextField, Button, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

export type CustomerInfo = {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    number: string;
    postalCode: string;
    city: string;
    country: string;
};

type Props = {
    onSubmit: (data: CustomerInfo) => void;
    disabled?: boolean;
};

export default function CustomerInfoForm({ onSubmit, disabled }: Props) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CustomerInfo>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            street: "",
            number: "",
            postalCode: "",
            city: "",
            country: "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>
                Delivery Information
            </Typography>

            <Stack spacing={2}>
                {[
                    { name: "firstName", label: "First Name" },
                    { name: "lastName", label: "Last Name" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "street", label: "Street" },
                    { name: "number", label: "Number" },
                    { name: "postalCode", label: "Postal Code" },
                    { name: "city", label: "City" },
                    { name: "country", label: "Country" },
                ].map((f) => (
                    <Controller
                        key={f.name}
                        name={f.name as keyof CustomerInfo}
                        control={control}
                        rules={{ required: `${f.label} is required` }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={f.label}
                                type={f.type || "text"}
                                error={!!errors[f.name as keyof CustomerInfo]}
                                helperText={
                                    errors[f.name as keyof CustomerInfo]?.message?.toString() || ""
                                }
                            />
                        )}
                    />
                ))}

                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={disabled}
                >
                    {disabled ? "Processing..." : "Proceed to Payment"}
                </Button>
            </Stack>
        </form>
    );
}
