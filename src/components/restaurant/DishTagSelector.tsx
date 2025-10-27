import { Chip, Stack } from "@mui/material";
import { FOOD_TAGS, labelize } from "../../types";

type Props = {
    tag: string;
    onChange: (value: string) => void;
};

export default function DishTagSelector({ tag, onChange }: Props) {
    return (
        <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
                label="All"
                variant={tag ? "outlined" : "filled"}
                color={tag ? "default" : "success"}
                onClick={() => onChange("")}
                sx={{
                    borderRadius: 2,
                    fontWeight: tag ? 400 : 600,
                }}
            />
            {FOOD_TAGS.map((ft) => (
                <Chip
                    key={ft}
                    label={labelize(ft)}
                    variant={tag === ft ? "filled" : "outlined"}
                    color={tag === ft ? "success" : "default"}
                    onClick={() => onChange(tag === ft ? "" : ft)}
                    clickable
                    sx={{
                        borderRadius: 2,
                        fontWeight: tag === ft ? 600 : 400,
                    }}
                />
            ))}
        </Stack>
    );
}
