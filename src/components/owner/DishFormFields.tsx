import { TextField, Stack } from "@mui/material";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

type DishFormFieldsProps = {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
};

export default function DishFormFields({ register, errors }: DishFormFieldsProps) {
    return (
        <Stack spacing={2}>
            <TextField
                label="Name"
                fullWidth
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message as string}
            />

            <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                {...register("description")}
            />

            <TextField
                label="Price (€)"
                type="number"
                fullWidth
                {...register("price", {
                    valueAsNumber: true,
                    validate: (v: any) =>
                        (typeof v === "number" && !Number.isNaN(v) && v >= 0) ||
                        "Price must be a non-negative number",
                })}
                error={!!errors.price}
                helperText={errors.price?.message as string}
            />

            <TextField
                label="Picture URL"
                fullWidth
                {...register("pictureUrl")}
            />
        </Stack>
    );
}
