import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { DISH_TYPES, labelize } from "../../types";

type Props = {
    type: string;
    onChange: (value: string) => void;
};

export default function DishTypeSelector({ type, onChange }: Props) {
    return (
        <ToggleButtonGroup
            size="small"
            color="success"
            value={type || null}
            exclusive
            onChange={(_, v) => onChange(v ?? "")}
            sx={{
                borderRadius: 3,
                "& .MuiToggleButton-root": {
                    textTransform: "none",
                    fontWeight: 500,
                    px: 1.8,
                    borderRadius: 2,
                    borderColor: "divider",
                },
                "& .Mui-selected": {
                    backgroundColor: "#22c55e22",
                    color: "#15803d",
                    fontWeight: 600,
                },
            }}
        >
            <ToggleButton value="">All</ToggleButton>
            {DISH_TYPES.map((t) => (
                <ToggleButton key={t} value={t}>
                    {labelize(t)}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
