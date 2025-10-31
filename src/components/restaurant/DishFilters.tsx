import { Box, Stack, Typography } from "@mui/material";
import DishTypeSelector from "./DishTypeSelector.tsx";
import DishTagSelector from "./DishTagSelector.tsx";
import DishSortSelector from "./DishSortSelector.tsx";

type Props = {
    type: string;
    tag: string;
    sortBy: string;
    onChange: (key: "type" | "tag" | "sortBy", value: string) => void;
};

export default function DishFilters({ type, tag, sortBy, onChange }: Props) {
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
                alignItems={{ xs: "stretch", md: "center" }}
                justifyContent="space-between"
            >
                {/* Left side: Filters */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={3}
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ flex: 1, gap: 3 }}
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

                {/* Right side: Sort */}
                <Box sx={{ minWidth: { xs: "100%", md: "auto" } }}>
                    <DishSortSelector sortBy={sortBy} onChange={(v) => onChange("sortBy", v)} />
                </Box>
            </Stack>
        </Box>
    );
}
