import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

type Props = {
    sortBy: string;
    onChange: (value: string) => void;
};

export const SORT_OPTIONS = [
    { value: "", label: "Default" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "name_asc", label: "Name: A-Z" },
    { value: "name_desc", label: "Name: Z-A" },
] as const;

export default function DishSortSelector({ sortBy, onChange }: Props) {
    return (
        <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortBy || ""}
                label="Sort By"
                onChange={(e) => onChange(e.target.value)}
                sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "divider",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                    },
                }}
            >
                {SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
