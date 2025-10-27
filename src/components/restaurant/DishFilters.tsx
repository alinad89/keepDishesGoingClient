import { Box, Stack, Typography } from "@mui/material";
import DishTypeSelector from "./DishTypeSelector.tsx";
import DishTagSelector from "./DishTagSelector.tsx";

type Props = {
    type: string;
    tag: string;
    onChange: (key: "type" | "tag", value: string) => void;
};

export default function DishFilters({ type, tag, onChange }: Props) {
    return (
        <Box
            sx={{
                mb: 3,
                p: 2,
                borderRadius: 3,
                backgroundColor: "background.paper",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            }}
        >
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
            >
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                    <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "text.secondary", mr: 1 }}
                    >
                        Category:
                    </Typography>
                    <DishTypeSelector type={type} onChange={(v) => onChange("type", v)} />
                </Stack>

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ mt: { xs: 1.5, md: 0 } }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "text.secondary", mr: 1 }}
                    >
                        Tags:
                    </Typography>
                    <DishTagSelector tag={tag} onChange={(v) => onChange("tag", v)} />
                </Stack>
            </Stack>
        </Box>
    );
}
